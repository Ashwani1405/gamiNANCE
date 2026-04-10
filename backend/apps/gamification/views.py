from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Badge, UserBadge, Quest, UserQuest, XPTransaction
from .serializers import (
    BadgeSerializer, UserBadgeSerializer,
    QuestSerializer, UserQuestSerializer,
    XPTransactionSerializer
)


class BadgeListView(generics.ListAPIView):
    """List all available badges."""
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserBadgeListView(generics.ListAPIView):
    """List badges earned by the authenticated user."""
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)


class QuestListView(generics.ListAPIView):
    """List all active quests."""
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quest.objects.filter(is_active=True)


class UserQuestListView(generics.ListAPIView):
    """List quests the authenticated user has joined."""
    serializer_class = UserQuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserQuest.objects.filter(user=self.request.user)


class JoinQuestView(APIView):
    """Join a quest."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quest_id):
        try:
            quest = Quest.objects.get(id=quest_id, is_active=True)
        except Quest.DoesNotExist:
            return Response(
                {"error": "Quest not found or inactive."},
                status=status.HTTP_404_NOT_FOUND
            )

        user_quest, created = UserQuest.objects.get_or_create(
            user=request.user, quest=quest
        )
        if not created:
            return Response(
                {"error": "Already joined this quest."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            UserQuestSerializer(user_quest).data,
            status=status.HTTP_201_CREATED
        )


class XPHistoryView(generics.ListAPIView):
    """XP transaction history for the authenticated user."""
    serializer_class = XPTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return XPTransaction.objects.filter(user=self.request.user)[:50]
