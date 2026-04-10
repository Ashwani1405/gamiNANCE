import type { UserQuest } from '../../types';

interface Props {
  quests: UserQuest[];
}

export default function QuestFeed({ quests }: Props) {
  if (quests.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No active quests. Check back soon!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {quests.map((uq, i) => (
        <div
          key={uq.id}
          className={`glass-card stagger-${Math.min(i + 1, 5)}`}
          style={{ padding: '18px 20px' }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <span style={{ fontSize: '1.4rem' }}>{uq.quest.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{uq.quest.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {uq.quest.description}
                </div>
              </div>
            </div>
            <div style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: uq.is_completed
                ? 'rgba(0, 184, 148, 0.15)'
                : 'rgba(108, 92, 231, 0.15)',
              color: uq.is_completed ? 'var(--color-success)' : 'var(--color-primary-light)',
              fontSize: '0.75rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {uq.is_completed ? '✓ Done' : `+${uq.quest.xp_reward} XP`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="quest-progress-track">
              <div
                className="quest-progress-fill"
                style={{ width: `${uq.progress_percent}%` }}
              />
            </div>
            <span style={{
              fontSize: '0.75rem', color: 'var(--color-text-secondary)',
              fontWeight: 600, minWidth: 40, textAlign: 'right',
            }}>
              {uq.current_value}/{uq.quest.target_value}
            </span>
          </div>

          {uq.quest.frequency !== 'one_time' && (
            <div style={{
              marginTop: 8, fontSize: '0.7rem',
              color: 'var(--color-text-muted)', textTransform: 'capitalize',
            }}>
              {uq.quest.frequency} quest · {uq.quest.module}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
