import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  const isAuthError = error.message.includes('Unauthorized') || error.message.includes('Only admins');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{isAuthError ? 'Access Denied' : 'Error Loading Data'}</AlertTitle>
        <AlertDescription>
          {isAuthError
            ? 'You do not have permission to access this resource. Please log in with an authorized account.'
            : error.message || 'An unexpected error occurred. Please try again later.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}
