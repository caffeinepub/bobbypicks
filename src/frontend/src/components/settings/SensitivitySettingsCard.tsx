import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sliders, Save } from 'lucide-react';
import { useSensitivitySettings } from '../../hooks/queries/useSensitivitySettings';
import { useUpdateSensitivitySettings } from '../../hooks/mutations/useUpdateSensitivitySettings';
import { VerificationRollingWindow } from '../../backend';

export function SensitivitySettingsCard() {
  const { data: settings, isLoading } = useSensitivitySettings();
  const { mutate: updateSettings, isPending } = useUpdateSensitivitySettings();

  const [edgeThreshold, setEdgeThreshold] = useState(5);
  const [rollingWindow, setRollingWindow] = useState<VerificationRollingWindow>(
    VerificationRollingWindow.last3Games
  );
  const [marketAlertsEnabled, setMarketAlertsEnabled] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize form with loaded settings
  useEffect(() => {
    if (settings && !hasInitialized) {
      setEdgeThreshold(Number(settings.edgeThresholdPercentage));
      setRollingWindow(settings.verificationRollingWindow);
      setMarketAlertsEnabled(settings.marketAlertsEnabled);
      setHasInitialized(true);
    }
  }, [settings, hasInitialized]);

  const handleSave = () => {
    updateSettings({
      edgeThresholdPercentage: BigInt(edgeThreshold),
      verificationRollingWindow: rollingWindow,
      marketAlertsEnabled,
    });
  };

  const hasChanges =
    settings &&
    (Number(settings.edgeThresholdPercentage) !== edgeThreshold ||
      settings.verificationRollingWindow !== rollingWindow ||
      settings.marketAlertsEnabled !== marketAlertsEnabled);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Sensitivity Settings
          </CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Sensitivity Settings
        </CardTitle>
        <CardDescription>
          Customize how edges are filtered and verified across the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Edge Threshold Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="edge-threshold">Minimum Edge Threshold</Label>
            <Badge variant="secondary">{edgeThreshold}%</Badge>
          </div>
          <Slider
            id="edge-threshold"
            min={1}
            max={10}
            step={1}
            value={[edgeThreshold]}
            onValueChange={(value) => setEdgeThreshold(value[0])}
            disabled={isPending}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {edgeThreshold === 1
              ? 'Show all edges, including slight discrepancies'
              : edgeThreshold >= 5
                ? 'Show only strong picks with significant edges'
                : 'Show moderate to strong picks'}
          </p>
        </div>

        {/* Rolling Window Toggle */}
        <div className="space-y-3">
          <Label>Statistical Verification Window</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={
                rollingWindow === VerificationRollingWindow.last3Games ? 'default' : 'outline'
              }
              onClick={() => setRollingWindow(VerificationRollingWindow.last3Games)}
              disabled={isPending}
              className="flex-1"
            >
              Last 3 Games
            </Button>
            <Button
              type="button"
              variant={
                rollingWindow === VerificationRollingWindow.seasonAverage ? 'default' : 'outline'
              }
              onClick={() => setRollingWindow(VerificationRollingWindow.seasonAverage)}
              disabled={isPending}
              className="flex-1"
            >
              Season Average
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {rollingWindow === VerificationRollingWindow.last3Games
              ? 'Focus on recent hot streaks and current form'
              : 'Focus on long-term consistency and season-wide trends'}
          </p>
        </div>

        {/* Market Alerts Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="market-alerts">Market Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when lines move more than 5% within one hour
              </p>
            </div>
            <Switch
              id="market-alerts"
              checked={marketAlertsEnabled}
              onCheckedChange={setMarketAlertsEnabled}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
