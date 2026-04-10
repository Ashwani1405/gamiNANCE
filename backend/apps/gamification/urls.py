from django.urls import path
from .views import (
    BadgeListView, UserBadgeListView,
    QuestListView, UserQuestListView, JoinQuestView,
    XPHistoryView,
)

urlpatterns = [
    path('badges/', BadgeListView.as_view(), name='badge-list'),
    path('badges/mine/', UserBadgeListView.as_view(), name='user-badges'),
    path('quests/', QuestListView.as_view(), name='quest-list'),
    path('quests/mine/', UserQuestListView.as_view(), name='user-quests'),
    path('quests/<int:quest_id>/join/', JoinQuestView.as_view(), name='join-quest'),
    path('xp/history/', XPHistoryView.as_view(), name='xp-history'),
]
