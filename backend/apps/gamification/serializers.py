from rest_framework import serializers
from .models import Badge, UserBadge, Quest, UserQuest, XPTransaction


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'rarity', 'xp_reward']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']


class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = ['id', 'title', 'description', 'icon', 'xp_reward',
                  'frequency', 'target_value', 'module', 'is_active', 'expires_at']


class UserQuestSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = UserQuest
        fields = ['id', 'quest', 'current_value', 'is_completed',
                  'completed_at', 'started_at', 'progress_percent']


class XPTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = XPTransaction
        fields = ['id', 'amount', 'reason', 'source', 'created_at']
