import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useMarketAlerts } from '../../hooks/queries/useMarketAlerts';
import { formatDistanceToNow } from 'date-fns';

export function MarketAlertsPanel() {
  const { data: alerts, isLoading } = useMarketAlerts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Alerts</CardTitle>
          <CardDescription>Loading recent line movements...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Alerts</CardTitle>
          <CardDescription>
            Significant line movements (&gt;5% within 1 hour) will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No recent market alerts. We'll notify you when lines move significantly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Alerts</CardTitle>
        <CardDescription>
          Recent significant line movements (&gt;5% within 1 hour)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isIncrease = alert.newLine > alert.previousLine;
            const Icon = isIncrease ? TrendingUp : TrendingDown;
            const colorClass = isIncrease ? 'text-green-500' : 'text-red-500';

            return (
              <div
                key={alert.propId.toString()}
                className="flex items-start justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${colorClass}`} />
                    <span className="font-medium">{alert.playerName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Line moved from {alert.previousLine.toFixed(1)} to {alert.newLine.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(Number(alert.timestamp) / 1000000), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <Badge variant={isIncrease ? 'default' : 'destructive'}>
                  {isIncrease ? '+' : ''}
                  {alert.percentageChange.toFixed(1)}%
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
