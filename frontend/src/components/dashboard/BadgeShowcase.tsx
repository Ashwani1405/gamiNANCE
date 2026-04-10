import type { UserBadge } from '../../types';

interface Props {
  badges: UserBadge[];
}

export default function BadgeShowcase({ badges }: Props) {
  if (badges.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No badges yet. Complete quests to earn them!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 12,
    }}>
      {badges.map((ub, i) => (
        <div
          key={ub.id}
          className={`glass-card stagger-${Math.min(i + 1, 5)}`}
          style={{
            padding: 20, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}
        >
          <div className={`badge-icon rarity-${ub.badge.rarity}`}>
            {ub.badge.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{ub.badge.name}</div>
            <div style={{
              fontSize: '0.65rem',
              color: `var(--color-rarity-${ub.badge.rarity})`,
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginTop: 2,
            }}>
              {ub.badge.rarity}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
