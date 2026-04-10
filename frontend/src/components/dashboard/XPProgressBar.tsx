import type { User } from '../../types';
import { Zap } from 'lucide-react';

interface Props {
  user: User;
}

export default function XPProgressBar({ user }: Props) {
  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>XP Progress</span>
        </div>
        <span style={{
          fontSize: '0.8rem', color: 'var(--color-text-secondary)',
        }}>
          {user.xp.toLocaleString()} / {(user.xp + (user.xp_for_next_level - Math.round(user.xp_for_next_level * user.xp_progress_percent / 100))).toLocaleString()} XP
        </span>
      </div>
      <div className="xp-bar-track">
        <div
          className="xp-bar-fill"
          style={{ width: `${user.xp_progress_percent}%` }}
        />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)',
      }}>
        <span>Level {user.level}</span>
        <span>{user.xp_progress_percent}%</span>
        <span>Level {user.level + 1}</span>
      </div>
    </div>
  );
}
