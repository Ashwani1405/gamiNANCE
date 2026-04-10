import { Shield } from 'lucide-react';

export default function FraudPage() {
  return (
    <div>
      <h1 style={{
        fontSize: '1.8rem', fontWeight: 800, marginBottom: 8,
        background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-success))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        FraudShield
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Real-time behavioral fraud detection with trust scoring
      </p>
      <div className="glass-card" style={{
        padding: 60, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'rgba(0, 184, 148, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={32} style={{ color: 'var(--color-success)' }} />
        </div>
        <h3 style={{ margin: 0, fontWeight: 700 }}>Coming in Phase 5</h3>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: 400, fontSize: '0.85rem' }}>
          WebSocket-driven real-time alerts, trust score dashboard, and behavioral anomaly detection.
        </p>
      </div>
    </div>
  );
}
