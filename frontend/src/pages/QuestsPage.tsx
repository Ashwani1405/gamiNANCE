import { useEffect, useState } from 'react';
import api from '../services/api';
import type { UserQuest } from '../types';
import QuestFeed from '../components/dashboard/QuestFeed';

export default function QuestsPage() {
  const [quests, setQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/quests/mine/')
      .then(res => setQuests(res.data.results || res.data))
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
        background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-light))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        Your Quests
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
        Complete quests to earn XP and unlock badges
      </p>
      <QuestFeed quests={quests} />
    </div>
  );
}
