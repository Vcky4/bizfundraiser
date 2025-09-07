import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Target, DollarSign, ArrowUpRight, Eye, BarChart3, Plus, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { walletAPI, projectsAPI, investmentsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { ProjectResponse, InvestmentResponse } from '@/types';

export const InvestorDashboard = () => {
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  });

  const { data: projects = {} as ProjectResponse } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getProjects,
  });

  const { data: investments = {} as InvestmentResponse } = useQuery({
    queryKey: ['investments'],
    queryFn: investmentsAPI.getInvestments,
  });
console.log(investments, 'investments')
console.log(projects, 'projects')
  const approvedProjects = projects?.projects?.filter(p => p.status === 'APPROVED') || [];
  const totalInvested = investments?.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const expectedReturns = investments?.investments?.reduce((sum, inv) => sum + inv.expectedReturn, 0) || 0;
  const activeInvestments = investments?.investments?.filter(inv => inv.status === 'ACTIVE') || [];
  const completedInvestments = investments?.investments?.filter(inv => inv.status === 'COMPLETED') || [];
  const totalProfit = expectedReturns - totalInvested || 0;
  const roiPercentage = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 100) : 0 || 0;

  const getInvestmentStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    {
      title: 'Wallet Balance',
      value: `₦${wallet?.balance?.toLocaleString() || '0'}`,
      change: '+5.2%',
      changeType: 'positive',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Available for investment',
    },
    {
      title: 'Total Invested',
      value: `₦${totalInvested.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `Across ${investments?.investments?.length} investments`,
    },
    {
      title: 'Expected Returns',
      value: `₦${expectedReturns.toLocaleString()}`,
      change: `+${roiPercentage}% ROI`,
      changeType: 'positive',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'From active investments',
    },
    {
      title: 'Available Projects',
      value: approvedProjects.length,
      change: 'New opportunities',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Ready for investment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Investor Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your investments and explore new opportunities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/investor/projects" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Browse Projects</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{stat.description}</p>
                  <div className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Investment Performance */}
          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Investment Performance</CardTitle>
              <CardDescription className="text-gray-600">
                Track your portfolio performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Portfolio ROI</span>
                  <span className="text-sm font-bold text-gray-900">{roiPercentage}%</span>
                </div>
                <Progress value={Math.min(roiPercentage, 100)} className="h-3" />
                <p className="text-xs text-gray-500">
                  {roiPercentage > 20 ? 'Excellent performance!' : 
                   roiPercentage > 10 ? 'Good returns' : 'Building portfolio'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Investment Completion</span>
                  <span className="text-sm font-bold text-gray-900">
                    {investments?.investments?.length > 0 ? Math.round((completedInvestments.length / investments?.investments?.length) * 100) : 0}%
                  </span>
                </div>
                <Progress value={investments?.investments?.length > 0 ? (completedInvestments.length / investments?.investments?.length) * 100 : 0} className="h-3" />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{activeInvestments.length}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{completedInvestments.length}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Projects */}
          <Card className="xl:col-span-2 card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Available Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    Discover new investment opportunities
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  {approvedProjects.length} available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedProjects.slice(0, 3).map((project, index) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{project.businessName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Goal: ₦{project.fundingGoal?.toLocaleString()}</span>
                          <span>Duration: {project.duration} months</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {project.projectedROI}% ROI
                        </Badge>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-medium">
                          {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        ₦{project.currentFunding?.toLocaleString()} funded of ₦{project.fundingGoal?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {approvedProjects.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects available</h3>
                    <p className="text-gray-600">Check back later for new investment opportunities.</p>
                  </div>
                )}
              </div>
              <Button asChild className="w-full mt-6">
                <Link to="/investor/projects" className="flex items-center justify-center">
                  View All Projects
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Investments */}
        <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Your Investments</CardTitle>
                <CardDescription className="text-gray-600">
                  Track your investment performance
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/investor/investments" className="flex items-center space-x-2">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments?.investments?.slice(0, 5).map((investment, index) => (
                <div key={investment.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{investment.project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{investment.project.businessName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Invested: ₦{investment.amount.toLocaleString()}</span>
                        <span>Expected: ₦{investment.expectedReturn.toLocaleString()}</span>
                        <span>ROI: {Math.round(((investment.expectedReturn - investment.amount) / investment.amount) * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getInvestmentStatusBadge(investment.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Invested: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                    <span>Payout: {new Date(investment.expectedPayoutDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              
              {investments?.investments?.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No investments yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start building your investment portfolio by exploring available projects and making your first investment.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link to="/investor/projects" className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Start Investing</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};