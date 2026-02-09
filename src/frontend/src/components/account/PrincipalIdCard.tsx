import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, User } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';

export function PrincipalIdCard() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) {
    return null;
  }

  const principalId = identity.getPrincipal().toString();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy Principal ID');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Principal ID
        </CardTitle>
        <CardDescription>
          Your unique identifier on the Internet Computer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
          {principalId}
        </div>
        <Button onClick={handleCopy} variant="outline" className="w-full">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Principal ID
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
