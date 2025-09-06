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
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { walletsApi, investmentsApi, projectsApi } from '@/services/api';

const InvestorOverview: React.FC = () => {
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletsApi.getWallet(),
  });

  const { data: investmentStats, isLoading: statsLoading } = useQuery({
    queryKey: ['investment-stats'],
    queryFn: () => investmentsApi.getInvestmentStats(),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getProjects({ limit: '5' }),
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => investmentsApi.getInvestments({ limit: '5' }),
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

  if (walletLoading || statsLoading || projectsLoading || investmentsLoading) {
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
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-primary-foreground/90">
          Here's what's happening with your investments today.
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
              Available for investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(investmentStats?.totalInvested || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investmentStats?.activeInvestments || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(investmentStats?.totalReturns || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit earned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Projects</CardTitle>
              <CardDescription>
                New investment opportunities
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/investor/projects">
                View All
                <Eye className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.projects?.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {project.business?.businessName || 'Business'}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatPercentage(project.expectedROI)} ROI
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {project.duration} months
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(project.amountRequested)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Goal
                    </p>
                  </div>
                </div>
              ))}
              {(!projects?.projects || projects.projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects available at the moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Investments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Investments</CardTitle>
              <CardDescription>
                Your latest investment activity
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/investor/investments">
                View All
                <Eye className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments?.investments?.slice(0, 3).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {investment.project?.title || 'Project'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Invested {new Date(investment.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant={investment.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {investment.isActive ? 'Active' : 'Completed'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(investment.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expected: {formatCurrency(investment.expectedReturn)}
                    </p>
                  </div>
                </div>
              ))}
              {(!investments?.investments || investments.investments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No investments yet
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
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex flex-col">
              <Link to="/investor/wallet">
                <Wallet className="h-6 w-6 mb-2" />
                Manage Wallet
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col">
              <Link to="/investor/projects">
                <FileText className="h-6 w-6 mb-2" />
                Browse Projects
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col">
              <Link to="/investor/investments">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Investments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorOverview;