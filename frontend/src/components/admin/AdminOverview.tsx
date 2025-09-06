import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  Building2,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi, projectsApi, usersApi } from '@/services/api';
import { ProjectStatus } from '@/types';

const AdminOverview: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboardStats(),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => adminApi.getRecentActivity(),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getProjects({ limit: '10' }),
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (statsLoading || activityLoading || projectsLoading || usersLoading) {
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

  const totalUsers = users?.length || 0;
  const totalProjects = projects?.projects?.length || 0;
  const pendingProjects = projects?.projects?.filter(p => p.status === ProjectStatus.PENDING).length || 0;
  const totalVolume = projects?.projects?.reduce((sum, p) => sum + p.amountRaised, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-primary-foreground/90">
          Monitor platform activity and manage the BizFundraiser ecosystem.
        </p>
      </div>

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
              Registered users
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
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingProjects}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Latest project submissions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/projects">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.projects?.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      by {project.business?.businessName || 'Business'}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1">{project.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(project.amountRequested)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested
                    </p>
                  </div>
                </div>
              ))}
              {(!projects?.projects || projects.projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description || 'Activity'}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.createdAt || new Date().toISOString())}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex flex-col">
              <Link to="/admin/projects">
                <FileText className="h-6 w-6 mb-2" />
                Manage Projects
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col">
              <Link to="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col">
              <Link to="/admin/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;