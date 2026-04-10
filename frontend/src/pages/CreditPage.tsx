import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, Info, ShieldAlert, CheckCircle, Activity, Star } from 'lucide-react';
import { fetchCreditDNA, type CreditDNA } from '../services/creditService';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

export default function CreditPage() {
  const [data, setData] = useState<CreditDNA | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreditDNA()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load Credit DNA."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="chat-spinner" style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
        <h3>Failed to load your Credit DNA</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'var(--color-success)';
    if (score >= 650) return 'var(--color-primary-light)';
    if (score >= 550) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getScoreRating = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Needs Work';
  };

  const scoreColor = getScoreColor(data.score);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div className="stagger-1" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,210,255,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <CreditCard size={28} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '2rem', fontWeight: 800, margin: 0,
              background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Credit DNA
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              ML-powered view of your alternative credit score built from gamified behaviors.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* Main Score Card */}
        <div className="glass-card stagger-2" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 200, height: 200,
            background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)`,
            borderRadius: '50%'
          }} />
          
          <h3 style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Current Score
          </h3>
          
          <div style={{ 
            fontSize: '5rem', fontWeight: 900, lineHeight: 1, marginBottom: 8,
            color: scoreColor, textShadow: `0 0 40px ${scoreColor}44`
          }}>
            {data.score}
          </div>
          
          <div style={{ 
            padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: '0.9rem',
            background: `${scoreColor}22`, color: scoreColor, border: `1px solid ${scoreColor}44`
          }}>
            {getScoreRating(data.score)}
          </div>
          
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <Activity size={16} />
            Updated just now (Real-time Model)
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="glass-card stagger-3" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={18} style={{ color: 'var(--color-warning)' }} />
            Behavior Matrix
          </h3>
          <div style={{ flex: 1, minHeight: 250, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.radar_data}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 8, color: 'var(--color-text-primary)' }}
                  itemStyle={{ color: 'var(--color-accent)' }}
                />
                <Radar name="You" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* SHAP Explanations */}
        <div className="glass-card stagger-4" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={18} style={{ color: 'var(--color-primary-light)' }} />
              Why my score changed
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '4px 10px', background: 'var(--color-bg-surface)', borderRadius: 12 }}>
              Powered by SHAP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', padding: '0 8px 8px', borderBottom: '1px solid var(--color-border)' }}>
              <span>Behavior Factor</span>
              <span>Impact</span>
            </div>
            
            {data.shap_breakdown.map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '12px 16px', background: 'var(--color-bg-surface)', borderRadius: 12,
                borderLeft: `4px solid ${item.impact >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}`
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.feature}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Current: {item.value < 1 ? item.value.toFixed(2) : Math.round(item.value)}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, 
                  color: item.impact >= 0 ? 'var(--color-success)' : 'var(--color-danger)' 
                }}>
                  {item.impact >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {item.impact > 0 ? '+' : ''}{Math.round(item.impact)} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card stagger-5" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
            Actionable Insights
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.recommendations.map((rec, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 12, background: 'rgba(0, 184, 148, 0.1)',
                border: '1px solid rgba(0, 184, 148, 0.2)', display: 'flex', gap: 16, alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, background: 'var(--color-success)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A2E', fontWeight: 800, flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                  {rec}
                </p>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: 32, padding: 20, borderRadius: 16, 
            background: 'linear-gradient(135deg, var(--color-bg-surface), var(--color-bg-card))',
            border: '1px dashed var(--color-border)'
          }}>
            <h4 style={{ margin: '0 0 8px', color: 'var(--color-primary-light)' }}>How does this work?</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Unlike traditional bureaus that depend on credit cards, <strong>FinZen Credit DNA</strong> is powered by an XGBoost Machine Learning model that analyzes your responsible platform behavior. The <strong>SHAP</strong> factors display mathematically how each behavior raises or lowers your baseline score.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
