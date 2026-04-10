from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, LeaderboardView, DashboardView

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),

    # Leaderboard
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),

    # Dashboard aggregate
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
