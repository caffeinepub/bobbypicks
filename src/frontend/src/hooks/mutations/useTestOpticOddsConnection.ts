import { useMutation } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';
import type { OpticOddsConnectionResult } from '../../backend';

export function useTestOpticOddsConnection() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (): Promise<OpticOddsConnectionResult> => {
      if (!actor) throw new Error('Actor not available');
      return actor.testOpticOddsConnection();
    },
    onError: (error: Error) => {
      toast.error('Connection test failed', {
        description: error.message,
      });
    },
  });
}
