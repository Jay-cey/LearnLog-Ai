import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Entry } from '@/types';

export function useEntries(userId?: string) {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['entries', userId],
    queryFn: () => api.get<Entry[]>(`/entries?user_id=${userId}`),
    enabled: !!userId,
  });

  const createEntry = useMutation({
    mutationFn: (data: { content: string; date: string }) => 
      api.post<Entry>(`/entries?user_id=${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });

  return {
    entries: entriesQuery.data,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    createEntry,
  };
}
