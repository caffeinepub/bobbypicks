import { LoginButton } from './LoginButton';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginRequiredState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-muted p-4 w-fit">
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Login Required</CardTitle>
          <CardDescription>
            You need to be logged in to access this page. Please login with your Internet Identity
            to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
