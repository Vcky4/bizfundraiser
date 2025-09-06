import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  DollarSign, 
  Percent,
  Save,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { UpdateCommissionRequest } from '@/types';

const AdminSettings: React.FC = () => {
  const [fundingCommission, setFundingCommission] = useState(0);
  const [profitCommission, setProfitCommission] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commissionSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['commission-settings'],
    queryFn: () => adminApi.getCommissionSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCommissionRequest) => adminApi.updateCommissionSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      toast({
        title: 'Settings Updated',
        description: 'Commission settings have been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update settings.',
        variant: 'destructive',
      });
    },
  });

  React.useEffect(() => {
    if (commissionSettings) {
      setFundingCommission(commissionSettings.fundingCommission || 0);
      setProfitCommission(commissionSettings.profitCommission || 0);
    }
  }, [commissionSettings]);

  const handleSave = () => {
    if (fundingCommission < 0 || profitCommission < 0) {
      toast({
        title: 'Invalid Values',
        description: 'Commission rates cannot be negative.',
        variant: 'destructive',
      });
      return;
    }
    updateMutation.mutate({
      fundingCommission,
      profitCommission,
    });
  };

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure platform-wide settings and commission rates
        </p>
      </div>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Commission Settings
          </CardTitle>
          <CardDescription>
            Set the platform commission rates for funding and profit sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="funding-commission">Funding Commission (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="funding-commission"
                  type="number"
                  placeholder="0.00"
                  value={fundingCommission}
                  onChange={(e) => setFundingCommission(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Commission charged on project funding amounts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit-commission">Profit Commission (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="profit-commission"
                  type="number"
                  placeholder="0.00"
                  value={profitCommission}
                  onChange={(e) => setProfitCommission(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Commission charged on investor profits
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Summary of current platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Funding Commission</h4>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {fundingCommission.toFixed(2)}%
              </Badge>
              <p className="text-sm text-muted-foreground">
                Charged on each project funding amount
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Profit Commission</h4>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {profitCommission.toFixed(2)}%
              </Badge>
              <p className="text-sm text-muted-foreground">
                Charged on investor returns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Information */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Information</CardTitle>
          <CardDescription>
            General platform details and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Platform Status</h4>
                <Badge className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Version</h4>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Maintenance Mode</h4>
                <Badge variant="outline">
                  Disabled
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Last Updated</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;