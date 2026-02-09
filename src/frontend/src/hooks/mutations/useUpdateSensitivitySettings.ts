import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';
import type { SensitivitySettings } from '../../backend';

export function useUpdateSensitivitySettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SensitivitySettings) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate edge threshold
      const threshold = Number(settings.edgeThresholdPercentage);
      if (threshold < 1 || threshold > 10) {
        throw new Error('Edge threshold must be between 1% and 10%');
      }
      
      return actor.updateSensitivitySettings(settings);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sensitivitySettings'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['edges'] });
      queryClient.invalidateQueries({ queryKey: ['propDetail'] });
      
      toast.success('Sensitivity settings saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save sensitivity settings');
    },
  });
}
