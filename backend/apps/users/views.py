from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserProfileSerializer, LeaderboardSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user account."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the authenticated user's profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LeaderboardView(generics.ListAPIView):
    """Top users ranked by XP."""
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.order_by('-xp')[:50]


class DashboardView(APIView):
    """Aggregated dashboard data for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = UserProfileSerializer(user).data

        # Recent XP transactions
        from apps.gamification.models import XPTransaction, UserQuest, UserBadge
        from apps.gamification.serializers import (
            XPTransactionSerializer, UserQuestSerializer, UserBadgeSerializer
        )

        recent_xp = XPTransaction.objects.filter(user=user)[:10]
        active_quests = UserQuest.objects.filter(user=user, is_completed=False)
        recent_badges = UserBadge.objects.filter(user=user)[:5]

        return Response({
            'profile': profile,
            'recent_xp': XPTransactionSerializer(recent_xp, many=True).data,
            'active_quests': UserQuestSerializer(active_quests, many=True).data,
            'recent_badges': UserBadgeSerializer(recent_badges, many=True).data,
        })
