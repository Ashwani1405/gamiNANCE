from django.urls import path
from .views import CreditDNAView

urlpatterns = [
    path('dna/', CreditDNAView.as_view(), name='credit_dna'),
]
