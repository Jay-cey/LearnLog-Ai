import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface UserStats {
  total_entries: number;
  total_words: number;
  level: number;
}

interface AnalyticsSummary {
  entries_this_week: number;
  entries_this_month: number;
  avg_word_count: number;
  top_topics: string[];
}

interface ActivityData {
  date: string;
  words: number;
  entries: number;
}

export function useAnalytics(userId?: string) {
  const statsQuery = useQuery({
    queryKey: ['analytics', 'stats', userId],
    queryFn: () => api.get<UserStats>(`/analytics/stats?user_id=${userId}`),
    enabled: !!userId,
  });

  const summaryQuery = useQuery({
    queryKey: ['analytics', 'summary', userId],
    queryFn: () => api.get<AnalyticsSummary>(`/analytics/summary?user_id=${userId}`),
    enabled: !!userId,
  });

  const activityQuery = useQuery({
    queryKey: ['analytics', 'activity', userId],
    queryFn: () => api.get<ActivityData[]>(`/analytics/activity?user_id=${userId}`),
    enabled: !!userId,
  });

  return {
    stats: statsQuery.data,
    summary: summaryQuery.data,
    activity: activityQuery.data,
    isLoading: statsQuery.isLoading || summaryQuery.isLoading || activityQuery.isLoading,
    isError: statsQuery.isError || summaryQuery.isError || activityQuery.isError,
  };
}
