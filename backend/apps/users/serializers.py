from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm',
                  'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    xp_for_next_level = serializers.ReadOnlyField()
    xp_progress_percent = serializers.ReadOnlyField()
    badges_count = serializers.SerializerMethodField()
    quests_completed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'xp', 'level', 'tier', 'avatar_url', 'bio',
            'streak_days', 'credit_score', 'trust_score',
            'xp_for_next_level', 'xp_progress_percent',
            'badges_count', 'quests_completed',
            'last_active', 'joined_at',
        ]
        read_only_fields = ['xp', 'level', 'tier', 'streak_days',
                            'credit_score', 'trust_score']

    def get_badges_count(self, obj):
        return obj.earned_badges.count()

    def get_quests_completed(self, obj):
        return obj.quests.filter(is_completed=True).count()


class LeaderboardSerializer(serializers.ModelSerializer):
    """Simplified user data for leaderboard (K-anonymity safe)."""

    class Meta:
        model = User
        fields = ['id', 'username', 'xp', 'level', 'tier', 'avatar_url']
