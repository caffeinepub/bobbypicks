import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { LoginRequiredState } from './LoginRequiredState';
import { LoadingState } from '../loading/LoadingState';
import { useEffect, useState } from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  // Auto-register authenticated users to ensure they have user access
  useEffect(() => {
    if (identity && actor && !hasRegistered && !isRegistering) {
      setIsRegistering(true);
      actor
        .register()
        .then(() => {
          setHasRegistered(true);
        })
        .catch((error) => {
          // Silently handle registration errors (user may already be registered)
          console.debug('Registration attempt:', error);
          setHasRegistered(true);
        })
        .finally(() => {
          setIsRegistering(false);
        });
    }
  }, [identity, actor, hasRegistered, isRegistering]);

  // Show loading while initializing identity
  if (isInitializing) {
    return <LoadingState message="Initializing..." />;
  }

  // Show loading while registering user access
  if (identity && isRegistering) {
    return <LoadingState message="Setting up your account..." />;
  }

  // Show login required if not authenticated
  if (!identity) {
    return <LoginRequiredState />;
  }

  // Render children once authenticated and registered
  return <>{children}</>;
}
