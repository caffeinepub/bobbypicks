import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useIsAdmin } from '../useIsAdmin';
import { toast } from 'sonner';

export function useRunSettlementNow() {
  const { actor } = useActor();
  const { data: isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isAdmin) throw new Error('Unauthorized: Only admins can run settlements');
      
      await actor.runSettlementNow();
    },
    onSuccess: () => {
      toast.success('Settlement run completed successfully');
      queryClient.invalidateQueries({ queryKey: ['settlementDiagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['settlementMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['livePicks'] });
    },
    onError: (error: Error) => {
      console.error('Settlement run error:', error);
      
      if (error.message.includes('Unauthorized') || error.message.includes('Only admins')) {
        toast.error('Access Denied', {
          description: 'You do not have permission to run settlements.',
        });
      } else if (error.message.includes('trap')) {
        toast.error('Settlement Failed', {
          description: 'An authorization error occurred. Please ensure you have admin privileges.',
        });
      } else {
        toast.error('Settlement Failed', {
          description: 'An error occurred while running settlement. Please try again.',
        });
      }
    },
  });
}
