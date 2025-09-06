import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import { adminApi, projectsApi, usersApi } from '@/services/api';
import { ProjectStatus } from '@/types';

const AdminAnalytics: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboardStats(),
  });

  const { data: platformMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: () => adminApi.getPlatformMetrics(),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getProjects({ limit: '100' }),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAllUsers(),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ProjectStatus.FUNDED:
        return 'bg-blue-100 text-blue-800';
      case ProjectStatus.REPAID:
        return 'bg-purple-100 text-purple-800';
      case ProjectStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ProjectStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading || metricsLoading || projectsLoading || usersLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  // Calculate analytics
  const totalUsers = users?.length || 0;
  const totalProjects = projects?.projects?.length || 0;
  const totalVolume = projects?.projects?.reduce((sum, p) => sum + p.amountRaised, 0) || 0;
  const totalRequested = projects?.projects?.reduce((sum, p) => sum + p.amountRequested, 0) || 0;
  
  const statusCounts = projects?.projects?.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const roleCounts = users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const pendingProjects = statusCounts[ProjectStatus.PENDING] || 0;
  const approvedProjects = statusCounts[ProjectStatus.APPROVED] || 0;
  const fundedProjects = statusCounts[ProjectStatus.FUNDED] || 0;
  const repaidProjects = statusCounts[ProjectStatus.REPAID] || 0;
  const rejectedProjects = statusCounts[ProjectStatus.REJECTED] || 0;

  const investors = roleCounts['INVESTOR'] || 0;
  const businesses = roleCounts['BUSINESS'] || 0;
  const admins = roleCounts['ADMIN'] || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              All time projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalVolume)}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 ? formatPercentage((repaidProjects / totalProjects) * 100) : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Project success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>
              Overview of all project statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">{pendingProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <span className="font-medium">{approvedProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Funded</span>
                </div>
                <span className="font-medium">{fundedProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Repaid</span>
                </div>
                <span className="font-medium">{repaidProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="font-medium">{rejectedProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>
              Breakdown of user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Investors</span>
                </div>
                <span className="font-medium">{investors}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Businesses</span>
                </div>
                <span className="font-medium">{businesses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Admins</span>
                </div>
                <span className="font-medium">{admins}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Funding Efficiency</h4>
              <div className="text-2xl font-bold">
                {totalRequested > 0 ? formatPercentage((totalVolume / totalRequested) * 100) : '0%'}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(totalVolume)} raised of {formatCurrency(totalRequested)} requested
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Average Project Size</h4>
              <div className="text-2xl font-bold">
                {totalProjects > 0 ? formatCurrency(totalRequested / totalProjects) : '$0'}
              </div>
              <p className="text-sm text-muted-foreground">
                Average amount requested per project
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">User Growth</h4>
              <div className="text-2xl font-bold">
                {totalUsers}
              </div>
              <p className="text-sm text-muted-foreground">
                Total registered users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;