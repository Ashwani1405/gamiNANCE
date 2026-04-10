from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/gamification/', include('apps.gamification.urls')),
    path('api/assistant/', include('apps.assistant.urls')),
    path('api/credit/', include('apps.credit.urls')),
]
