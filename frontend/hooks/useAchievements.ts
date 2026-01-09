import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  criteria: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export function useAchievements(userId?: string) {
  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: () => api.get<Achievement[]>(`/achievements?user_id=${userId}`),
    enabled: !!userId,
  });
}
