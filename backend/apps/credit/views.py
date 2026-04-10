import os
import json
import logging
import numpy as np
import pandas as pd
import xgboost as xgb
import shap

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

# ==========================================
# MOCK MODEL TRAINING (ON-THE-FLY)
# In production, this would load a pre-trained .pkl model
# ==========================================
_xgb_model = None
_shap_explainer = None
_feature_names = ['streak_days', 'level', 'badges_count', 'trust_score', 'quests_completed']

def _get_or_train_model():
    """Trains a simple XGBoost model to simulate the Credit Engine."""
    global _xgb_model, _shap_explainer
    
    if _xgb_model is not None and _shap_explainer is not None:
        return _xgb_model, _shap_explainer
        
    logger.info("Training mock Credit DNA XGBoost model on-the-fly...")
    
    # 1. Generate synthetic data for training (1000 samples)
    np.random.seed(42)
    n_samples = 1000
    
    # Features
    streak = np.random.randint(0, 100, n_samples)
    level = np.random.randint(1, 50, n_samples)
    badges = np.random.randint(0, 30, n_samples)
    trust = np.random.uniform(50.0, 100.0, n_samples)
    quests = np.random.randint(0, 200, n_samples)
    
    X = pd.DataFrame({
        'streak_days': streak,
        'level': level,
        'badges_count': badges,
        'trust_score': trust,
        'quests_completed': quests
    })
    
    # Target (Credit Score between 300 and 850)
    # The true function gives weights to the features
    base_score = 400
    y = base_score + (streak * 1.5) + (level * 2) + (badges * 3) + ((trust - 50) * 2) + (quests * 0.5)
    
    # Add random noise
    y += np.random.normal(0, 20, n_samples)
    
    # Clip to standard credit score bounds
    y = np.clip(y, 300, 850)
    
    # 2. Train XGBoost model
    _xgb_model = xgb.XGBRegressor(n_estimators=50, max_depth=3, learning_rate=0.1, random_state=42)
    _xgb_model.fit(X, y)
    
    # 3. Initialize SHAP Explainer
    _shap_explainer = shap.TreeExplainer(_xgb_model)
    
    return _xgb_model, _shap_explainer

class CreditDNAView(APIView):
    """
    GET /api/credit/dna/
    Returns the user's ML-generated Credit Score, SHAP breakdown, and Radar Chart metrics.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # 1. Extract user features for the model
        badges_count = user.earned_badges.count()
        quests_count = user.quests.filter(is_completed=True).count()
        
        user_features = pd.DataFrame([{
            'streak_days': user.streak_days,
            'level': user.level,
            'badges_count': badges_count,
            'trust_score': user.trust_score,
            'quests_completed': quests_count
        }])
        
        # 2. Get Model & Explainer
        model, explainer = _get_or_train_model()
        
        # 3. Predict Score
        prediction = model.predict(user_features)[0]
        final_score = int(np.clip(prediction, 300, 850))
        
        # Update user's score in DB
        if user.credit_score != final_score:
            user.credit_score = final_score
            user.save(update_fields=['credit_score'])
        
        # 4. Calculate SHAP values
        shap_values = explainer.shap_values(user_features)
        base_value = explainer.expected_value
        if isinstance(base_value, (list, np.ndarray)):
            base_value = base_value[0]
            
        # Format SHAP breakdown for the frontend
        shap_breakdown = []
        for feature_name, shap_val in zip(_feature_names, shap_values[0]):
            shap_breakdown.append({
                'feature': feature_name.replace('_', ' ').title(),
                'value': float(user_features[feature_name].iloc[0]),
                'impact': float(shap_val)
            })
            
        # Sort by absolute impact to show most important first
        shap_breakdown.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        # 5. Generate Radar Chart Data
        # Map user features to generalized 0-100 metrics for the chart
        radar_data = [
            {
                'subject': 'Consistency',
                'A': min((user.streak_days / 30) * 100, 100),
                'fullMark': 100
            },
            {
                'subject': 'Trust',
                'A': user.trust_score,
                'fullMark': 100
            },
            {
                'subject': 'Engagement',
                'A': min(((quests_count * 2) + (badges_count * 5)) / 100 * 100, 100),
                'fullMark': 100
            },
            {
                'subject': 'Experience',
                'A': min((user.level / 50) * 100, 100),
                'fullMark': 100
            }
        ]
        
        # 6. Generate Recommendations based on lowest SHAP values
        lowest_features = sorted(shap_breakdown, key=lambda x: x['impact'])
        recommendations = []
        
        for f in lowest_features[:2]:
            if f['impact'] < 10:  # Only recommend if it's dragging down or barely helping
                if 'Streak' in f['feature']:
                    recommendations.append("Log in daily to build your engagement streak.")
                elif 'Badges' in f['feature']:
                    recommendations.append("Earn more achievement badges by completing hidden goals.")
                elif 'Trust' in f['feature']:
                    recommendations.append("Maintain a clean record to boost your FraudShield Trust Score.")
                elif 'Quests' in f['feature']:
                    recommendations.append("Complete more daily and weekly quests.")
                elif 'Level' in f['feature']:
                    recommendations.append("Earn XP through financial actions to level up faster.")

        # Ensure we always have at least one fallback recommendation
        if not recommendations:
            recommendations.append("Keep up the great work! Your financial habits are building a strong profile.")

        return Response({
            'score': final_score,
            'base_value': float(base_value),
            'shap_breakdown': shap_breakdown,
            'radar_data': radar_data,
            'recommendations': recommendations
        })
