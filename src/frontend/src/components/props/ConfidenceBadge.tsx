import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ConfidenceBadgeProps {
  size?: 'sm' | 'default' | 'lg';
}

export function ConfidenceBadge({ size = 'default' }: ConfidenceBadgeProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <Badge variant="default" className={`${textSize} gap-1`}>
      <CheckCircle2 className={iconSize} />
      High Confidence
    </Badge>
  );
}
