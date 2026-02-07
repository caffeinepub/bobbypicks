import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AddToParlayButton } from '../parlay/AddToParlayButton';
import { ConfidenceBadge } from '../props/ConfidenceBadge';
import { isHighConfidence } from '../../lib/verification/highConfidence';
import type { EdgeWithDetails } from '../../hooks/queries/useEdges';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

interface DailyTopParlayProps {
  edges: EdgeWithDetails[];
}

export function DailyTopParlay({ edges }: DailyTopParlayProps) {
  if (edges.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No edge opportunities available at this time. Check back later or refresh the data from
          Settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 max-w-5xl mx-auto">
      {edges.map((edge, index) => {
        const highConfidence = isHighConfidence(edge.verification);
        const edgeColor = edge.edge.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';

        return (
          <Card
            key={edge.prop.id.toString()}
            className={`transition-all hover:shadow-lg ${
              highConfidence ? 'border-accent/50 bg-accent/5' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <CardTitle className="text-xl">{edge.prop.playerName}</CardTitle>
                    {highConfidence && <ConfidenceBadge />}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{edge.prop.team}</span>
                    <span>•</span>
                    <span className="capitalize">
                      {edge.prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs">
                      {edge.prop.sport.toString().toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <AddToParlayButton edge={edge} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
                  <p className="text-lg font-bold">{edge.prop.line.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Consensus Line</p>
                  <p className="text-lg font-bold">
                    {edge.projection ? edge.projection.value.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Edge</p>
                  <p className={`text-lg font-bold ${edgeColor}`}>
                    {Math.abs(edge.edge.edgePercentage).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-lg font-bold">
                    {edge.verification
                      ? `${(edge.verification.confidenceScore * 100).toFixed(0)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link to="/prop/$propId" params={{ propId: edge.prop.id.toString() }}>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
