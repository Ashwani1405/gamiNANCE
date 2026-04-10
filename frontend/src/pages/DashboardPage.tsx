import { useEffect, useState } from 'react';
import api from '../services/api';
import type { DashboardData } from '../types';
import GamifiedOrb from '../components/dashboard/GamifiedOrb';
import XPProgressBar from '../components/dashboard/XPProgressBar';
import StatsCards from '../components/dashboard/StatsCards';
import QuestFeed from '../components/dashboard/QuestFeed';
import BadgeShowcase from '../components/dashboard/BadgeShowcase';
import XPHistory from '../components/dashboard/XPHistory';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get<DashboardData>('/users/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '60vh',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin-slow 1s linear infinite',
        }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
        Failed to load dashboard data.
      </div>
    );
  }

  const { profile, recent_xp, active_quests, recent_badges } = data;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Welcome back, {profile.first_name || profile.username} 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 4, fontSize: '0.9rem' }}>
          Here's your financial health at a glance
        </p>
      </div>

      {/* Top Section: Orb + XP + Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 24,
        marginBottom: 32,
      }}>
        {/* Orb */}
        <div className="glass-card" style={{
          padding: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GamifiedOrb user={profile} />
        </div>

        {/* XP + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <XPProgressBar user={profile} />
          <StatsCards user={profile} />
        </div>
      </div>

      {/* Bottom Section: Quests + Badges + XP History */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {/* Active Quests */}
        <div>
          <h2 style={{
            fontSize: '1.1rem', fontWeight: 700, marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            🎯 Active Quests
            <span style={{
              fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6,
              background: 'rgba(108,92,231,0.15)', color: 'var(--color-primary-light)',
              fontWeight: 600,
            }}>
              {active_quests.length}
            </span>
          </h2>
          <QuestFeed quests={active_quests} />
        </div>

        {/* Right Column: Badges + XP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Badges */}
          <div>
            <h2 style={{
              fontSize: '1.1rem', fontWeight: 700, marginBottom: 16,
            }}>
              🏆 Recent Badges
            </h2>
            <BadgeShowcase badges={recent_badges} />
          </div>

          {/* XP History */}
          <div>
            <h2 style={{
              fontSize: '1.1rem', fontWeight: 700, marginBottom: 16,
            }}>
              ⚡ XP Activity
            </h2>
            <div className="glass-card" style={{ padding: 16 }}>
              <XPHistory transactions={recent_xp} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
