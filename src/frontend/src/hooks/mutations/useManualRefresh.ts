import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

export function useManualRefresh() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.importData();
    },
    onSuccess: () => {
      // Invalidate all data queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['edges'] });
      queryClient.invalidateQueries({ queryKey: ['propDetail'] });
      queryClient.invalidateQueries({ queryKey: ['refreshStatus'] });
      toast.success('Data refreshed successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to refresh data', {
        description: error.message,
      });
    },
  });
}
