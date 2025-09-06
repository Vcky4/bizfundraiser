import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Wallet,
  ArrowUpRight,
  Users,
  Target,
  Plus,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { walletsApi, projectsApi } from '@/services/api';
import { ProjectStatus } from '@/types';

const BusinessOverview: React.FC = () => {
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletsApi.getWallet(),
  });

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

  const totalRequested = projects?.reduce((sum, project) => sum + project.amountRequested, 0) || 0;
  const totalRaised = projects?.reduce((sum, project) => sum + project.amountRaised, 0) || 0;
  const activeProjects = projects?.filter(project => 
    project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.FUNDED
  ).length || 0;
  const pendingProjects = projects?.filter(project => 
    project.status === ProjectStatus.PENDING
  ).length || 0;

  if (walletLoading || projectsLoading) {
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to your business dashboard!</h1>
        <p className="text-primary-foreground/90">
          Manage your projects, track funding, and grow your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet?.balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
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
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Projects</CardTitle>
              <CardDescription>
                Your project funding applications
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/business/projects">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(project.amountRequested)} • {project.duration} months
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {getProgressPercentage(project).toFixed(1)}% funded
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(project.amountRaised)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Raised
                    </p>
                  </div>
                </div>
              ))}
              {(!projects || projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects yet. Create your first project to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button asChild className="h-16 flex flex-col">
                <Link to="/business/projects">
                  <Plus className="h-6 w-6 mb-2" />
                  Create New Project
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col">
                <Link to="/business/projects">
                  <FileText className="h-6 w-6 mb-2" />
                  Manage Projects
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col">
                <Link to="/business/wallet">
                  <Wallet className="h-6 w-6 mb-2" />
                  View Wallet
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col">
                <Link to="/business/analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance Overview */}
      {projects && projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Performance</CardTitle>
            <CardDescription>
              Overview of your project funding progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getProgressPercentage(project).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(project)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(project.amountRaised)} raised</span>
                    <span>{formatCurrency(project.amountRequested)} goal</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessOverview;