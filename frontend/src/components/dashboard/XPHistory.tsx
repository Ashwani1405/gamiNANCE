import type { XPTransaction } from '../../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  transactions: XPTransaction[];
}

const sourceColors: Record<string, string> = {
  quest: 'var(--color-primary-light)',
  badge: 'var(--color-warning)',
  invoice: 'var(--color-success)',
  credit: 'var(--color-accent)',
  fraud: 'var(--color-danger)',
  system: 'var(--color-text-muted)',
};

export default function XPHistory({ transactions }: Props) {
  if (transactions.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-card-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: tx.amount > 0
              ? 'rgba(0, 184, 148, 0.15)'
              : 'rgba(225, 112, 85, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {tx.amount > 0
              ? <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
              : <TrendingDown size={16} style={{ color: 'var(--color-danger)' }} />
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{tx.reason}</div>
            <div style={{
              fontSize: '0.65rem', color: sourceColors[tx.source] || 'var(--color-text-muted)',
              textTransform: 'capitalize', marginTop: 2,
            }}>
              {tx.source}
            </div>
          </div>
          <span style={{
            fontWeight: 700, fontSize: '0.85rem',
            color: tx.amount > 0 ? 'var(--color-success)' : 'var(--color-danger)',
          }}>
            {tx.amount > 0 ? '+' : ''}{tx.amount} XP
          </span>
        </div>
      ))}
    </div>
  );
}
