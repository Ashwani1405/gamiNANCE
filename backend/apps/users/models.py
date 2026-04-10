from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with gamification fields."""

    TIER_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
        ('obsidian', 'Obsidian'),
    ]

    xp = models.IntegerField(default=0, help_text="Total experience points")
    level = models.IntegerField(default=1)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='bronze')
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, default='')
    streak_days = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    # Credit DNA summary
    credit_score = models.IntegerField(default=0)

    # FraudShield summary
    trust_score = models.FloatField(default=100.0)

    class Meta:
        ordering = ['-xp']

    def __str__(self):
        return f"{self.username} (Lvl {self.level} - {self.get_tier_display()})"

    @property
    def xp_for_next_level(self):
        """XP required to reach the next level (exponential curve)."""
        return int(100 * (1.5 ** (self.level - 1)))

    @property
    def xp_progress_percent(self):
        """Percentage progress to next level."""
        xp_needed = self.xp_for_next_level
        # XP accumulated in current level
        xp_prev = sum(int(100 * (1.5 ** i)) for i in range(self.level - 1))
        current = self.xp - xp_prev
        return min(round((current / xp_needed) * 100, 1), 100)

    def add_xp(self, amount, reason=''):
        """Award XP and handle level-ups and tier promotions."""
        self.xp += amount
        # Check for level up
        while self.xp >= sum(int(100 * (1.5 ** i)) for i in range(self.level)):
            self.level += 1
        # Tier thresholds
        tier_map = {
            5: 'silver',
            10: 'gold',
            20: 'platinum',
            35: 'obsidian',
        }
        for lvl_threshold, tier_name in tier_map.items():
            if self.level >= lvl_threshold:
                self.tier = tier_name
        self.save()
