import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { projectsApi } from '@/services/api';
import { ProjectStatus } from '@/types';

const BusinessAnalytics: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectsApi.getMyProjects(),
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

  const getProgressPercentage = (project: any) => {
    return Math.min((project.amountRaised / project.amountRequested) * 100, 100);
  };

  // Calculate analytics
  const totalProjects = projects?.length || 0;
  const totalRequested = projects?.reduce((sum, project) => sum + project.amountRequested, 0) || 0;
  const totalRaised = projects?.reduce((sum, project) => sum + project.amountRaised, 0) || 0;
  const averageROI = (projects && projects.length > 0)
    ? projects.reduce((sum, project) => sum + project.expectedROI, 0) / projects.length
    : 0;
  
  const statusCounts = projects?.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const activeProjects = projects?.filter(project => 
    project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.FUNDED
  ).length || 0;

  const completedProjects = projects?.filter(project => 
    project.status === ProjectStatus.REPAID
  ).length || 0;

  const pendingProjects = projects?.filter(project => 
    project.status === ProjectStatus.PENDING
  ).length || 0;

  const rejectedProjects = projects?.filter(project => 
    project.status === ProjectStatus.REJECTED
  ).length || 0;

  if (projectsLoading) {
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

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Funding Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRaised)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(averageROI)}
            </div>
            <p className="text-xs text-muted-foreground">
              Expected returns
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
              {totalProjects > 0 ? formatPercentage((completedProjects / totalProjects) * 100) : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>
              Overview of your project statuses
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
                <span className="font-medium">{statusCounts[ProjectStatus.APPROVED] || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Funded</span>
                </div>
                <span className="font-medium">{statusCounts[ProjectStatus.FUNDED] || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Repaid</span>
                </div>
                <span className="font-medium">{completedProjects}</span>
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

        <Card>
          <CardHeader>
            <CardTitle>Funding Performance</CardTitle>
            <CardDescription>
              Your funding success metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Requested</span>
                <span className="font-medium">{formatCurrency(totalRequested)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Raised</span>
                <span className="font-medium text-green-600">{formatCurrency(totalRaised)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Funding Rate</span>
                <span className="font-medium">
                  {totalRequested > 0 ? formatPercentage((totalRaised / totalRequested) * 100) : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalRequested > 0 ? (totalRaised / totalRequested) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects Performance</CardTitle>
          <CardDescription>
            Detailed view of your recent projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects?.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatPercentage(project.expectedROI)} ROI
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {project.duration} months
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Raised: </span>
                    <span className="font-medium">{formatCurrency(project.amountRaised)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Goal: </span>
                    <span className="font-medium">{formatCurrency(project.amountRequested)}</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(project)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!projects || projects.length === 0) && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first project to see analytics
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessAnalytics;