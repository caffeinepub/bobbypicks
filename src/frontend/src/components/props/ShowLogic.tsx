import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EdgeWithDetails } from '../../hooks/queries/useEdges';

interface ShowLogicProps {
  edge: EdgeWithDetails;
}

export function ShowLogic({ edge }: ShowLogicProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs text-muted-foreground hover:text-foreground py-2"
        >
          {isOpen ? (
            <ChevronUp className="h-3 w-3 mr-1" />
          ) : (
            <ChevronDown className="h-3 w-3 mr-1" />
          )}
          Show Logic
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                  <p className="text-sm font-semibold">
                    {edge.verification
                      ? `${(edge.verification.confidenceScore * 100).toFixed(0)}%`
                      : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Edge Percentage</p>
                  <p className="text-sm font-semibold">
                    {Math.abs(edge.edge.edgePercentage).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
                  <p className="text-sm font-semibold">{edge.prop.line.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Consensus/Projection</p>
                  <p className="text-sm font-semibold">
                    {edge.projection ? edge.projection.value.toFixed(1) : 'Not available'}
                  </p>
                </div>
              </div>

              {edge.verification?.verificationSummary && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Verification Summary</p>
                    <p className="text-sm leading-relaxed">{edge.verification.verificationSummary}</p>
                  </div>
                </>
              )}

              {!edge.verification?.verificationSummary && (
                <>
                  <Separator />
                  <p className="text-xs text-muted-foreground italic">
                    Verification summary not available for this pick.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
