import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { exportParlayToText } from '../../lib/parlay/exportSummary';
import type { ParlayLeg } from '../../state/parlay/types';

interface CopySummaryButtonProps {
  legs: ParlayLeg[];
}

export function CopySummaryButton({ legs }: CopySummaryButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const summary = exportParlayToText(legs);
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Parlay summary copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Button onClick={handleCopy} disabled={copied}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy Summary
        </>
      )}
    </Button>
  );
}
