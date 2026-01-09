import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StreakData } from '@/types';

export function useStreak(userId?: string) {
  const streakQuery = useQuery({
    queryKey: ['streak', userId],
    queryFn: () => api.get<StreakData>(`/streak?user_id=${userId}`),
    enabled: !!userId,
  });

  return {
    streak: streakQuery.data,
    isLoading: streakQuery.isLoading,
    isError: streakQuery.isError,
  };
}
