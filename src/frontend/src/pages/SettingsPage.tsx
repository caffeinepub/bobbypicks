import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminOnly } from '../components/auth/AdminOnly';
import { useRefreshStatus } from '../hooks/queries/useRefreshStatus';
import { useManualRefresh } from '../hooks/mutations/useManualRefresh';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield, Key } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useProviderConfig } from '../hooks/queries/useProviderConfig';
import { useSaveProviderConfig } from '../hooks/mutations/useSaveProviderConfig';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { data: refreshStatus } = useRefreshStatus();
  const { mutate: refresh, isPending } = useManualRefresh();
  const { data: providerConfig } = useProviderConfig();
  const { mutate: saveConfig, isPending: isSaving } = useSaveProviderConfig();

  const [oddsApiKey, setOddsApiKey] = useState('');
  const [dailyFantasyApiKey, setDailyFantasyApiKey] = useState('');
  const [opticOddsApiKey, setOpticOddsApiKey] = useState('');

  useEffect(() => {
    if (providerConfig) {
      setOddsApiKey(providerConfig.oddsApiKey);
      setDailyFantasyApiKey(providerConfig.dailyFantasyApiKey);
      setOpticOddsApiKey(providerConfig.opticOddsApiKey);
    }
  }, [providerConfig]);

  const handleSaveConfig = () => {
    saveConfig({
      oddsApiKey,
      dailyFantasyApiKey,
      opticOddsApiKey,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and data refresh</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Status</CardTitle>
          <CardDescription>View the current state of prop data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Refresh</span>
            <span className="text-sm font-medium">
              {refreshStatus
                ? formatDistanceToNow(new Date(Number(refreshStatus) / 1000000), {
                    addSuffix: true,
                  })
                : 'Never'}
            </span>
          </div>
        </CardContent>
      </Card>

      <AdminOnly>
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-accent" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API keys for data providers (The Odds API, DailyFantasyAPI.io, OpticOdds)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oddsApiKey">The Odds API Key</Label>
              <Input
                id="oddsApiKey"
                type="password"
                placeholder="Enter your Odds API key"
                value={oddsApiKey}
                onChange={(e) => setOddsApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyFantasyApiKey">DailyFantasyAPI.io Key</Label>
              <Input
                id="dailyFantasyApiKey"
                type="password"
                placeholder="Enter your DailyFantasyAPI.io key"
                value={dailyFantasyApiKey}
                onChange={(e) => setDailyFantasyApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opticOddsApiKey">OpticOdds API Key</Label>
              <Input
                id="opticOddsApiKey"
                type="password"
                placeholder="Enter your OpticOdds API key"
                value={opticOddsApiKey}
                onChange={(e) => setOpticOddsApiKey(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveConfig} disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Admin Controls
            </CardTitle>
            <CardDescription>
              These controls are only visible to authenticated administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Manual Data Refresh</AlertTitle>
              <AlertDescription>
                Trigger a manual refresh to fetch the latest lines from PrizePicks and sportsbook
                providers. This may take a few moments.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refresh()} disabled={isPending} className="w-full">
              <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              {isPending ? 'Refreshing Data...' : 'Refresh Data Now'}
            </Button>
          </CardContent>
        </Card>
      </AdminOnly>

      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize how data is displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Additional display preferences and filtering options will be available in future
            updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
