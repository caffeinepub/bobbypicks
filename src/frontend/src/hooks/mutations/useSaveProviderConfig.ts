import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';
import type { IngestionProviderConfig } from '../../backend';

export function useSaveProviderConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: IngestionProviderConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveProviderConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerConfig'] });
      toast.success('API configuration saved successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to save configuration', {
        description: error.message,
      });
    },
  });
}
