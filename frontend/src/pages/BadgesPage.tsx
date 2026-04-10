import { useEffect, useState } from 'react';
import api from '../services/api';
import type { UserBadge } from '../types';

export default function BadgesPage() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/badges/mine/')
      .then(res => setBadges(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin-slow 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{
        fontSize: '1.8rem', fontWeight: 800, marginBottom: 8,
        background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-warning))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        Your Badges
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Achievements earned through your financial journey
      </p>

      {badges.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            No badges earned yet. Complete quests and financial actions to unlock them!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {badges.map((ub, i) => (
            <div
              key={ub.id}
              className={`glass-card stagger-${Math.min(i + 1, 5)}`}
              style={{
                padding: 24,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 12, textAlign: 'center',
              }}
            >
              <div className={`badge-icon rarity-${ub.badge.rarity}`}
                style={{ width: 72, height: 72, borderRadius: 18, fontSize: '2rem' }}>
                {ub.badge.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{ub.badge.name}</div>
                <div style={{
                  fontSize: '0.7rem',
                  color: `var(--color-rarity-${ub.badge.rarity})`,
                  textTransform: 'uppercase', fontWeight: 600,
                  letterSpacing: '0.05em', marginTop: 4,
                }}>
                  {ub.badge.rarity} · +{ub.badge.xp_reward} XP
                </div>
              </div>
              <p style={{
                fontSize: '0.8rem', color: 'var(--color-text-secondary)',
                margin: 0, lineHeight: 1.4,
              }}>
                {ub.badge.description}
              </p>
              <div style={{
                fontSize: '0.65rem', color: 'var(--color-text-muted)',
              }}>
                Earned {new Date(ub.earned_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
