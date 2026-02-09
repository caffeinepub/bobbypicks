import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSensitivitySettings } from '../../hooks/queries/useSensitivitySettings';
import { VerificationRollingWindow } from '../../backend';
import type { EdgeWithDetails } from '../../hooks/queries/useEdges';

interface ShowLogicProps {
  edge: EdgeWithDetails;
}

export function ShowLogic({ edge }: ShowLogicProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: settings } = useSensitivitySettings();

  const rollingWindowLabel =
    settings?.verificationRollingWindow === VerificationRollingWindow.last3Games
      ? 'Last 3 Games'
      : 'Season Average';

  return (
    <div className="border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between px-4 py-2 h-auto font-normal hover:bg-muted/50"
      >
        <span className="text-xs text-muted-foreground">Show Logic</span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 py-3 bg-muted/30 space-y-3 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
              <p className="font-medium">
                {edge.verification
                  ? `${(edge.verification.confidenceScore * 100).toFixed(0)}%`
                  : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Edge Percentage</p>
              <p className="font-medium">
                {edge.edge ? `${Math.abs(edge.edge.edgePercentage).toFixed(1)}%` : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
              <p className="font-medium">{edge.prop.line.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Consensus Line</p>
              <p className="font-medium">
                {edge.projection ? edge.projection.value.toFixed(1) : 'Not available'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Verification Summary</p>
              <Badge variant="outline" className="text-xs">
                {rollingWindowLabel}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed">
              {edge.verification?.verificationSummary || 'Not available'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
