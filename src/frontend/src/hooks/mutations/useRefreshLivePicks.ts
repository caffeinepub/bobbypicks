import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

export function useRefreshLivePicks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.refreshLivePicksInternal();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livePicks'] });
      queryClient.invalidateQueries({ queryKey: ['livePicksLastUpdated'] });
      queryClient.invalidateQueries({ queryKey: ['livePicksDiagnostics'] });
      toast.success('Live Picks refreshed successfully');
    },
    onError: (error: Error) => {
      // Show generic error message to avoid leaking sensitive backend details
      toast.error('Failed to refresh Live Picks. Check Settings for details.');
      console.error('Live Picks refresh error:', error);
    },
  });
}
