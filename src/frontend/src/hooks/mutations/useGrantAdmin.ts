import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';
import { toast } from 'sonner';

export function useGrantAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalString: string) => {
      if (!actor) throw new Error('Actor not available');
      
      let principal: Principal;
      try {
        principal = Principal.fromText(principalString);
      } catch (error) {
        throw new Error('Invalid Principal ID format');
      }

      await actor.assignCallerUserRole(principal, UserRole.admin);
    },
    onSuccess: () => {
      // Invalidate admin check queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      toast.success('Admin privileges granted successfully');
    },
    onError: (error: Error) => {
      const message = error.message || 'Failed to grant admin privileges';
      toast.error(message);
    },
  });
}
