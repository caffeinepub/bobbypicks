import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { useParlay } from '../../state/parlay/ParlayProvider';
import type { EdgeWithDetails } from '../../hooks/queries/useEdges';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AddToParlayButtonProps {
  edge: EdgeWithDetails;
  size?: 'sm' | 'default' | 'lg';
}

export function AddToParlayButton({ edge, size = 'default' }: AddToParlayButtonProps) {
  const { legs, addLeg, removeLeg, isAtMaxLegs } = useParlay();

  const propId = edge.prop.id.toString();
  const isInParlay = legs.some((leg) => leg.propId === propId);
  const isDisabled = !isInParlay && isAtMaxLegs;

  const handleToggle = () => {
    if (isInParlay) {
      removeLeg(propId);
    } else {
      addLeg({
        propId,
        playerName: edge.prop.playerName,
        team: edge.prop.team,
        statCategory: edge.prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim(),
        prizePicksLine: edge.prop.line,
        consensusLine: edge.projection?.value || null,
        edgePercentage: edge.edge.edgePercentage,
        confidenceScore: edge.verification?.confidenceScore || null,
        verification: edge.verification,
      });
    }
  };

  const button = (
    <Button
      onClick={handleToggle}
      variant={isInParlay ? 'secondary' : 'default'}
      size={size}
      disabled={isDisabled}
    >
      {isInParlay ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          In Parlay
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Add to Parlay
        </>
      )}
    </Button>
  );

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>Maximum 6 legs reached</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
