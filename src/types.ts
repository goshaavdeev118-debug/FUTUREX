export interface User {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  joinedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  color: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  likedByUser?: boolean;
  videoEmbedId?: string;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied';
  reply?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  bestStreak: number;
  history: string[]; // dates of completion YYYY-MM-DD
  category: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  timeframe: 'monthly' | 'yearly';
  category: string;
  completed: boolean;
  targetDate: string;
  progress: number; // 0 to 100
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
}

export interface PlannerEvent {
  id: string;
  title: string;
  timeSlot: string; // "09:00 - 10:00"
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressMax: number;
  progressCurrent: number;
}

export interface UserStats {
  xp: number;
  level: number;
  pomodorosCompleted: number;
}

export interface PersonalContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: 'work' | 'family' | 'friends' | 'other';
  notes?: string;
  createdAt: string;
}

