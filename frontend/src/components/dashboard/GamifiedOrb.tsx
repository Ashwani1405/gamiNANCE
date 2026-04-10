import type { User } from '../../types';

interface Props {
  user: User;
}

export default function GamifiedOrb({ user }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className={`orb-container tier-${user.tier}`}>
        <div className="orb-outer" />
        <div className="orb-inner" style={{
          '--tier-color': `var(--color-tier-${user.tier})`,
        } as React.CSSProperties}>
          <span style={{
            fontSize: '2.2rem', fontWeight: 800,
            background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {user.level}
          </span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Level
          </span>
        </div>
      </div>

      {/* Tier Badge below orb */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 16px', borderRadius: 20,
        background: `linear-gradient(135deg, color-mix(in srgb, var(--color-tier-${user.tier}) 20%, transparent), color-mix(in srgb, var(--color-tier-${user.tier}) 5%, transparent))`,
        border: `1px solid color-mix(in srgb, var(--color-tier-${user.tier}) 30%, transparent)`,
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {user.tier}
        </span>
      </div>
    </div>
  );
}
