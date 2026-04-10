import { useEffect, useState } from 'react';
import api from '../services/api';
import type { LeaderboardUser } from '../types';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard/')
      .then(res => setUsers(res.data.results || res.data))
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
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Leaderboard
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Top players ranked by experience points
      </p>

      <div className="glass-card" style={{ padding: '8px 0', overflow: 'hidden' }}>
        {users.map((user, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `rank-${rank}` : '';

          return (
            <div key={user.id} className="leaderboard-row">
              <div className={`leaderboard-rank ${rankClass}`} style={
                rank > 3 ? {
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-secondary)',
                } : {}
              }>
                {rank <= 3 ? <Trophy size={14} /> : rank}
              </div>

              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, var(--color-tier-${user.tier}), var(--color-primary))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem', color: '#0A0A1A',
              }}>
                {user.username[0].toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {user.username}
                </div>
                <div style={{
                  fontSize: '0.7rem', color: 'var(--color-text-muted)',
                  textTransform: 'capitalize',
                }}>
                  Lvl {user.level} · {user.tier}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {user.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                  XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
