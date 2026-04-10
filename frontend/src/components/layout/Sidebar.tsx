import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, Trophy, ScrollText, Shield,
  CreditCard, LogOut, Zap, Settings, Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/quests', icon: ScrollText, label: 'Quests' },
  { path: '/badges', icon: Trophy, label: 'Badges' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/credit', icon: CreditCard, label: 'Credit DNA' },
  { path: '/fraud', icon: Shield, label: 'FraudShield' },
  { path: '/assistant', icon: Sparkles, label: 'FinZen AI' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {/* Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 36, paddingLeft: 8,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(108,92,231,0.3)',
        }}>
          <Zap size={22} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
            gamiNANCE
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            Level Up Finance
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      {user && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: 16, marginTop: 16,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 8px', marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, var(--color-tier-${user.tier}), var(--color-primary))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', color: '#0A0A1A',
            }}>
              {user.first_name?.[0] || user.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.first_name || user.username}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Lvl {user.level} · {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
              </div>
            </div>
          </div>
          <button className="sidebar-link" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
