from django.conf import settings
from django.db import models


class Badge(models.Model):
    """Achievement badges earned through financial behaviors."""

    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🏆', help_text="Emoji icon")
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='common')
    xp_reward = models.IntegerField(default=50)
    criteria = models.JSONField(
        default=dict,
        help_text="JSON criteria for auto-award logic"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['rarity', 'name']

    def __str__(self):
        return f"{self.icon} {self.name} ({self.get_rarity_display()})"


class UserBadge(models.Model):
    """Junction table: which users have earned which badges."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='earned_badges'
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='holders')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.username} → {self.badge.name}"


class Quest(models.Model):
    """Weekly/daily quests that award XP for financial behaviors."""

    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('one_time', 'One-Time'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🎯')
    xp_reward = models.IntegerField(default=100)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='weekly')
    target_value = models.IntegerField(
        default=1,
        help_text="Number of actions needed to complete"
    )
    module = models.CharField(
        max_length=50,
        default='general',
        help_text="credit, invoice, fraud, or general"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-is_active', '-xp_reward']

    def __str__(self):
        return f"{self.icon} {self.title} (+{self.xp_reward} XP)"


class UserQuest(models.Model):
    """Tracks a user's progress on a specific quest."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quests'
    )
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='participants')
    current_value = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quest')
        ordering = ['is_completed', '-started_at']

    def __str__(self):
        status = "✅" if self.is_completed else f"{self.current_value}/{self.quest.target_value}"
        return f"{self.user.username} → {self.quest.title} [{status}]"

    @property
    def progress_percent(self):
        if self.quest.target_value == 0:
            return 100
        return min(round((self.current_value / self.quest.target_value) * 100, 1), 100)


class XPTransaction(models.Model):
    """Audit log of every XP gain/loss."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='xp_transactions'
    )
    amount = models.IntegerField()
    reason = models.CharField(max_length=200)
    source = models.CharField(
        max_length=50,
        default='system',
        help_text="quest, badge, credit, invoice, fraud, manual"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.amount > 0 else ''
        return f"{self.user.username}: {sign}{self.amount} XP ({self.reason})"
