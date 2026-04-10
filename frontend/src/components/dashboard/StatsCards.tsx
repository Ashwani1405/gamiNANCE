import type { User } from '../../types';
import { Flame, CreditCard, Shield, Trophy } from 'lucide-react';

interface Props {
  user: User;
}

export default function StatsCards({ user }: Props) {
  const stats = [
    {
      label: 'Streak',
      value: `${user.streak_days} days`,
      icon: Flame,
      color: 'var(--color-warning)',
      bg: 'rgba(253, 203, 110, 0.1)',
    },
    {
      label: 'Credit Score',
      value: user.credit_score.toString(),
      icon: CreditCard,
      color: 'var(--color-accent)',
      bg: 'rgba(0, 210, 255, 0.1)',
    },
    {
      label: 'Trust Score',
      value: `${user.trust_score}%`,
      icon: Shield,
      color: 'var(--color-success)',
      bg: 'rgba(0, 184, 148, 0.1)',
    },
    {
      label: 'Badges',
      value: user.badges_count.toString(),
      icon: Trophy,
      color: 'var(--color-primary-light)',
      bg: 'rgba(162, 155, 254, 0.1)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 12,
    }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`glass-card stagger-${Math.min(i + 1, 5)}`}
          style={{ padding: '18px 16px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: stat.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <span style={{
              fontSize: '0.75rem', color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}>
              {stat.label}
            </span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
