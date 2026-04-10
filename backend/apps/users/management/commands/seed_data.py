import sys
import io
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.gamification.models import Badge, Quest, UserBadge, UserQuest, XPTransaction
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with sample gamification data'

    def handle(self, *args, **options):
        self.stdout.write("[SEED] Seeding gamiNANCE data...")

        # Create demo user
        user, created = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@gaminance.app',
                'first_name': 'Alex',
                'last_name': 'Rivera',
                'xp': 1850,
                'level': 7,
                'tier': 'silver',
                'streak_days': 12,
                'credit_score': 685,
                'trust_score': 94.5,
                'bio': 'Building my financial future, one quest at a time.',
            }
        )
        if created:
            user.set_password('demo1234')
            user.save()
            self.stdout.write(self.style.SUCCESS(f"  [OK] Created user: {user.username}"))

        # Create leaderboard users
        leaderboard_data = [
            ('priya_s', 'Priya', 'Sharma', 4200, 12, 'gold', 23),
            ('carlos_m', 'Carlos', 'Martinez', 3100, 10, 'gold', 8),
            ('aisha_k', 'Aisha', 'Khan', 2750, 9, 'silver', 31),
            ('jordan_t', 'Jordan', 'Taylor', 2100, 8, 'silver', 5),
            ('mei_l', 'Mei', 'Lin', 1600, 6, 'silver', 19),
            ('samuel_o', 'Samuel', 'Okafor', 1200, 5, 'bronze', 3),
            ('elena_v', 'Elena', 'Volkov', 950, 4, 'bronze', 14),
            ('raj_p', 'Raj', 'Patel', 600, 3, 'bronze', 7),
        ]
        for uname, fname, lname, xp, level, tier, streak in leaderboard_data:
            u, c = User.objects.get_or_create(
                username=uname,
                defaults={
                    'email': f'{uname}@gaminance.app',
                    'first_name': fname,
                    'last_name': lname,
                    'xp': xp,
                    'level': level,
                    'tier': tier,
                    'streak_days': streak,
                    'credit_score': 500 + (xp // 10),
                    'trust_score': min(100, 70 + (level * 3)),
                }
            )
            if c:
                u.set_password('password')
                u.save()

        self.stdout.write(self.style.SUCCESS("  [OK] Created leaderboard users"))

        # Create badges
        badges_data = [
            ('Zero Fraud Zone', '30 days with no suspicious activity', '🛡️', 'epic', 200),
            ('Perfect Reconciler', '10 invoices matched with 100% accuracy', '📄', 'rare', 150),
            ('Credit Climber', 'Improved score 3 months in a row', '📈', 'epic', 200),
            ('On a Roll', '14-day engagement streak', '🔥', 'common', 100),
            ('First Steps', 'Completed your first quest', '👣', 'common', 50),
            ('Data Pioneer', 'Connected alternative data source', '🔗', 'rare', 150),
            ('Budget Master', 'Stayed under budget for a full month', '💰', 'rare', 150),
            ('Speed Demon', 'Reconciled 5 invoices in one session', '⚡', 'common', 75),
            ('Trust Elite', 'Maintained 95%+ trust score for 60 days', '💎', 'legendary', 500),
            ('Community Leader', 'Referred 5 friends who joined', '👥', 'epic', 250),
        ]
        for name, desc, icon, rarity, xp_reward in badges_data:
            Badge.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'icon': icon,
                    'rarity': rarity,
                    'xp_reward': xp_reward,
                }
            )
        self.stdout.write(self.style.SUCCESS("  [OK] Created badges"))

        # Award some badges to demo user
        for badge_name in ['First Steps', 'On a Roll', 'Data Pioneer', 'Speed Demon']:
            badge = Badge.objects.get(name=badge_name)
            UserBadge.objects.get_or_create(user=user, badge=badge)

        # Create quests
        quests_data = [
            ('Invoice Sprint', 'Upload and reconcile 3 invoices this week', '📄', 150, 'weekly', 3, 'invoice'),
            ('Credit Check-In', 'Review your credit factors breakdown', '📊', 50, 'daily', 1, 'credit'),
            ('Fraud Watch', 'Review and resolve pending fraud alerts', '🔍', 100, 'weekly', 5, 'fraud'),
            ('Streak Keeper', 'Log in 7 days in a row', '🔥', 100, 'weekly', 7, 'general'),
            ('Budget Blueprint', 'Set up a monthly spending plan', '🎯', 200, 'one_time', 1, 'general'),
            ('Score Booster', 'Improve your credit score by 15 points', '📈', 300, 'monthly', 1, 'credit'),
            ('Clean Record', 'Go 14 days without any fraud flags', '🛡️', 200, 'monthly', 14, 'fraud'),
            ('Social Butterfly', 'Refer a friend to gamiNANCE', '🤝', 250, 'one_time', 1, 'general'),
        ]
        for title, desc, icon, xp_reward, freq, target, module in quests_data:
            Quest.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'icon': icon,
                    'xp_reward': xp_reward,
                    'frequency': freq,
                    'target_value': target,
                    'module': module,
                    'expires_at': timezone.now() + timedelta(days=7) if freq == 'weekly' else None,
                }
            )
        self.stdout.write(self.style.SUCCESS("  [OK] Created quests"))

        # Assign quests to demo user with partial progress
        quest_progress = [
            ('Invoice Sprint', 2, False),
            ('Streak Keeper', 5, False),
            ('Credit Check-In', 1, True),
            ('Budget Blueprint', 0, False),
        ]
        for title, progress, completed in quest_progress:
            quest = Quest.objects.get(title=title)
            uq, _ = UserQuest.objects.get_or_create(
                user=user, quest=quest,
                defaults={
                    'current_value': progress,
                    'is_completed': completed,
                    'completed_at': timezone.now() if completed else None,
                }
            )

        # Create XP history
        xp_events = [
            (50, 'Reconciled invoice #1042', 'invoice'),
            (50, 'Reconciled invoice #1043', 'invoice'),
            (100, 'Completed quest: Credit Check-In', 'quest'),
            (200, 'Credit score improved by 12 pts', 'credit'),
            (50, 'First Steps badge earned', 'badge'),
            (100, 'On a Roll badge earned', 'badge'),
            (150, 'Data Pioneer badge earned', 'badge'),
            (75, 'Speed Demon badge earned', 'badge'),
            (50, 'Daily login streak bonus', 'system'),
            (100, '7-day fraud-free streak', 'fraud'),
        ]
        for amount, reason, source in xp_events:
            XPTransaction.objects.get_or_create(
                user=user,
                reason=reason,
                defaults={'amount': amount, 'source': source}
            )
        self.stdout.write(self.style.SUCCESS("  [OK] Created XP history"))

        self.stdout.write(self.style.SUCCESS("\n[DONE] Seeding complete! Login with demo / demo1234"))
