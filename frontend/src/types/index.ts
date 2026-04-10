export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  xp: number;
  level: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'obsidian';
  avatar_url: string | null;
  bio: string;
  streak_days: number;
  credit_score: number;
  trust_score: number;
  xp_for_next_level: number;
  xp_progress_percent: number;
  badges_count: number;
  quests_completed: number;
  last_active: string;
  joined_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
}

export interface UserBadge {
  id: number;
  badge: Badge;
  earned_at: string;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one_time';
  target_value: number;
  module: string;
  is_active: boolean;
  expires_at: string | null;
}

export interface UserQuest {
  id: number;
  quest: Quest;
  current_value: number;
  is_completed: boolean;
  completed_at: string | null;
  started_at: string;
  progress_percent: number;
}

export interface XPTransaction {
  id: number;
  amount: number;
  reason: string;
  source: string;
  created_at: string;
}

export interface DashboardData {
  profile: User;
  recent_xp: XPTransaction[];
  active_quests: UserQuest[];
  recent_badges: UserBadge[];
}

export interface LeaderboardUser {
  id: number;
  username: string;
  xp: number;
  level: number;
  tier: string;
  avatar_url: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
