import { useState } from 'react';
import { useCallerUserProfile } from '../hooks/queries/useCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/mutations/useSaveCallerUserProfile';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Save, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { SensitivitySettingsCard } from '../components/settings/SensitivitySettingsCard';
import { MarketAlertsPanel } from '../components/alerts/MarketAlertsPanel';
import { useSensitivitySettings } from '../hooks/queries/useSensitivitySettings';
import type { UserProfile } from '../backend';

export default function ProfilePage() {
  const { data: userProfile, isLoading, error } = useCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  const { data: sensitivitySettings } = useSensitivitySettings();

  const [name, setName] = useState('');
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize form with loaded profile data
  if (userProfile && !hasInitialized) {
    setName(userProfile.name);
    setFavoriteTeams(userProfile.favoriteTeams);
    setNotificationPreferences(userProfile.notificationPreferences);
    setHasInitialized(true);
  }

  if (isLoading) {
    return <LoadingState message="Loading your profile..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const handleAddTeam = () => {
    const trimmedTeam = newTeam.trim();
    if (trimmedTeam && !favoriteTeams.includes(trimmedTeam)) {
      setFavoriteTeams([...favoriteTeams, trimmedTeam]);
      setNewTeam('');
    }
  };

  const handleRemoveTeam = (teamToRemove: string) => {
    setFavoriteTeams(favoriteTeams.filter((team) => team !== teamToRemove));
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }

    const updatedProfile: UserProfile = {
      name: name.trim(),
      favoriteTeams,
      notificationPreferences,
      sensitivitySettings: userProfile.sensitivitySettings,
    };

    saveProfileMutation.mutate(updatedProfile, {
      onSuccess: () => {
        toast.success('Profile saved successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to save profile');
      },
    });
  };

  const hasChanges =
    userProfile &&
    (userProfile.name !== name.trim() ||
      JSON.stringify(userProfile.favoriteTeams) !== JSON.stringify(favoriteTeams) ||
      userProfile.notificationPreferences !== notificationPreferences);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your name and favorite teams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Favorite Teams</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a team..."
                value={newTeam}
                onChange={(e) => setNewTeam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTeam();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTeam} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {favoriteTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {favoriteTeams.map((team) => (
                  <Badge key={team} variant="secondary" className="gap-1">
                    {team}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(team)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notification Preferences</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new edges and picks
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationPreferences}
              onCheckedChange={setNotificationPreferences}
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={saveProfileMutation.isPending || !hasChanges}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Sensitivity Settings */}
      <SensitivitySettingsCard />

      {/* Market Alerts Panel - Only shown when alerts are enabled */}
      {sensitivitySettings?.marketAlertsEnabled && <MarketAlertsPanel />}
    </div>
  );
}
