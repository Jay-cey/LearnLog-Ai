export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider: string;
}

export interface Entry {
  id: string;
  content: string;
  date: string;
  word_count: number;
  created_at: string;
  ai_score?: number;
  tags?: Record<string, any>;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_entries: number;
  last_entry_date?: string;
}

export interface AnalyticsSummary {
  entries_this_week: number;
  entries_this_month: number;
  avg_word_count: number;
  top_topics: string[];
}
