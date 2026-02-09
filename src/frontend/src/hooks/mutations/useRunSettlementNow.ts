import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

export function useRunSettlementNow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if backend method exists
      if (typeof (actor as any).runSettlementNow === 'function') {
        await (actor as any).runSettlementNow();
      } else {
        throw new Error('Settlement engine not yet implemented in backend');
      }
    },
    onSuccess: () => {
      toast.success('Settlement run completed successfully');
      queryClient.invalidateQueries({ queryKey: ['settlementDiagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['settlementMetrics'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('not yet implemented')) {
        toast.error('Settlement engine not available', {
          description: 'The settlement engine is not yet implemented in the backend.',
        });
      } else {
        toast.error('Settlement run failed', {
          description: 'An error occurred while running settlement. Please try again.',
        });
      }
      console.error('Settlement run error:', error);
    },
  });
}
