import os
import json
import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from groq import Groq

from django.contrib.auth import get_user_model
from apps.gamification.models import XPTransaction, UserQuest, UserBadge

logger = logging.getLogger(__name__)

User = get_user_model()

FINZEN_SYSTEM_PROMPT = """You are **FinZen AI** — a warm, knowledgeable financial wellness assistant inside the gamiNANCE platform.

Your personality:
- Friendly, encouraging, and concise.
- You celebrate progress (XP gains, badge unlocks, streak milestones).
- You explain complex financial concepts in simple, relatable terms.
- You use emojis sparingly but effectively (✨, 📈, 🎯, 🔥).
- You NEVER give legally binding financial advice — always add a gentle disclaimer when recommending specific financial actions.

You have access to the user's live profile data (provided below). Reference it naturally in conversation:
- Credit DNA score and what affects it
- Trust Score from FraudShield
- XP, level, tier, and streak progress
- Active quests and recently earned badges
- Recent XP transaction history

When users ask about improving their credit score, reference the gamiNANCE gamification system — show them which quests or actions would earn XP and improve their standing.

Keep responses concise (2-4 short paragraphs max). Use markdown formatting for clarity. If the user asks something completely outside personal finance, gently redirect while staying friendly.

---
USER PROFILE CONTEXT:
{user_context}
---
"""


def _build_user_context(user):
    """Build a rich context string from the user's live data for RAG."""

    # Basic profile
    context_parts = [
        f"Name: {user.first_name} {user.last_name} (@{user.username})",
        f"Level: {user.level} | Tier: {user.get_tier_display()} | XP: {user.xp:,}",
        f"XP to next level: {user.xp_for_next_level:,} ({user.xp_progress_percent}% progress)",
        f"Streak: {user.streak_days} days",
        f"Credit DNA Score: {user.credit_score}",
        f"FraudShield Trust Score: {user.trust_score}%",
    ]

    # Recent badges
    recent_badges = UserBadge.objects.filter(user=user).select_related('badge')[:5]
    if recent_badges:
        badge_list = ", ".join(
            f"{ub.badge.icon} {ub.badge.name} ({ub.badge.get_rarity_display()})"
            for ub in recent_badges
        )
        context_parts.append(f"Recent Badges: {badge_list}")

    # Active quests
    active_quests = UserQuest.objects.filter(
        user=user, is_completed=False
    ).select_related('quest')[:5]
    if active_quests:
        quest_lines = []
        for uq in active_quests:
            quest_lines.append(
                f"  - {uq.quest.icon} {uq.quest.title}: "
                f"{uq.current_value}/{uq.quest.target_value} "
                f"(+{uq.quest.xp_reward} XP on completion)"
            )
        context_parts.append("Active Quests:\n" + "\n".join(quest_lines))

    # Recent XP transactions
    recent_xp = XPTransaction.objects.filter(user=user)[:8]
    if recent_xp:
        xp_lines = []
        for tx in recent_xp:
            sign = "+" if tx.amount > 0 else ""
            xp_lines.append(f"  - {sign}{tx.amount} XP: {tx.reason}")
        context_parts.append("Recent XP History:\n" + "\n".join(xp_lines))

    return "\n".join(context_parts)


class ChatView(APIView):
    """
    POST /api/assistant/chat/
    Body: { "message": "...", "history": [ {"role": "user"|"assistant", "content": "..."}, ... ] }
    Returns: { "reply": "..." }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        history = request.data.get('history', [])

        if not user_message:
            return Response(
                {'error': 'Message is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build RAG context
        user_context = _build_user_context(request.user)
        system_prompt = FINZEN_SYSTEM_PROMPT.format(user_context=user_context)

        # Build messages array for Groq
        messages = [{"role": "system", "content": system_prompt}]

        # Add conversation history (limit to last 10 turns for context window)
        for msg in history[-10:]:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            if role in ('user', 'assistant') and content:
                messages.append({"role": role, "content": content})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            api_key = os.environ.get('GROQ_API_KEY', '')
            if not api_key:
                return Response(
                    {'error': 'AI service is not configured. Please set GROQ_API_KEY.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            client = Groq(api_key=api_key)

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
                top_p=0.9,
            )

            reply = completion.choices[0].message.content
            return Response({'reply': reply})

        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return Response(
                {'error': 'AI service temporarily unavailable. Please try again.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
