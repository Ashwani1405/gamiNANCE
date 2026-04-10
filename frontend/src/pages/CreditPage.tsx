import { CreditCard } from 'lucide-react';

export default function CreditPage() {
  return (
    <div>
      <h1 style={{
        fontSize: '1.8rem', fontWeight: 800, marginBottom: 8,
        background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-accent))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        Credit DNA
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Your alternative credit profile powered by real behavior
      </p>
      <div className="glass-card" style={{
        padding: 60, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'rgba(0, 210, 255, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CreditCard size={32} style={{ color: 'var(--color-accent)' }} />
        </div>
        <h3 style={{ margin: 0, fontWeight: 700 }}>Coming in Phase 4</h3>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: 400, fontSize: '0.85rem' }}>
          ML-powered credit scoring with SHAP explainability, radar charts, and actionable improvement tips.
        </p>
      </div>
    </div>
  );
}
