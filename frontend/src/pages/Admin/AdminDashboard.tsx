import { useQuery } from '@tanstack/react-query';
import { Users, FileText, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle, Activity, BarChart3, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { projectsAPI, investmentsAPI, usersAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { ProjectResponse } from '@/types';

export const AdminDashboard = () => {
  const { data: projects = {} as ProjectResponse } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getProjects,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: investmentsAPI.getAllInvestments,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getUsers,
  });

  const pendingProjects = projects?.projects?.filter(p => p.status === 'PENDING') || [];
  const approvedProjects = projects?.projects?.filter(p => p.status === 'APPROVED') || [];
  const fundedProjects = projects?.projects?.filter(p => p.status === 'FUNDED') || [];
  const rejectedProjects = projects?.projects?.filter(p => p.status === 'REJECTED') || [];
  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const unverifiedUsers = users.filter(u => !u.isVerified);
  const activeInvestments = investments?.filter(inv => inv.status === 'ACTIVE') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case 'FUNDED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Funded</Badge>;
      case 'REPAID':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">Repaid</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      title: 'Total Users',
      value: users.length,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${unverifiedUsers.length} unverified`,
    },
    {
      title: 'Total Projects',
      value: projects?.projects?.length || 0,
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `${pendingProjects.length} pending`,
    },
    {
      title: 'Pending Approvals',
      value: pendingProjects.length,
      change: pendingProjects.length > 0 ? 'Needs attention' : 'All clear',
      changeType: pendingProjects.length > 0 ? 'warning' : 'positive',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Projects awaiting review',
    },
    {
      title: 'Active Projects',
      value: approvedProjects.length,
      change: '+15%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Approved for funding',
    },
    {
      title: 'Total Investments',
      value: `₦${totalInvestments.toLocaleString()}`,
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: `${investments.length} investments`,
    },
    {
      title: 'Funded Projects',
      value: fundedProjects.length,
      change: '+5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Fully funded',
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
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Monitor platform activity and manage approvals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Activity className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
                  <div className={`flex items-center text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : stat.changeType === 'warning' ? (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Pending Approvals */}
          <Card className="xl:col-span-2 card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Pending Project Approvals</CardTitle>
                  <CardDescription className="text-gray-600">
                    Projects waiting for your review
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                  {pendingProjects.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProjects.slice(0, 5).map((project, index) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{project.businessName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Goal: ₦{project.fundingGoal.toLocaleString()}</span>
                          <span>ROI: {project.projectedROI}%</span>
                          <span>Duration: {project.duration} months</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(project.status)}
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ₦{project.currentFunding.toLocaleString()} funded ({Math.round((project.currentFunding / project.fundingGoal) * 100)}%)
                    </p>
                  </div>
                ))}
                {pendingProjects.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending approvals at the moment.</p>
                  </div>
                )}
              </div>
              <Button variant="outline" asChild className="w-full mt-6">
                <Link to="/admin/projects" className="flex items-center justify-center">
                  Review All Projects
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Platform Overview</CardTitle>
              <CardDescription className="text-gray-600">
                Key metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Project Success Rate</span>
                  <span className="text-sm font-bold text-gray-900">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">User Verification</span>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(((users.length - unverifiedUsers.length) / users.length) * 100)}%
                  </span>
                </div>
                <Progress value={((users.length - unverifiedUsers.length) / users.length) * 100} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Investment Completion</span>
                  <span className="text-sm font-bold text-gray-900">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{approvedProjects.length}</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{rejectedProjects.length}</div>
                    <div className="text-xs text-gray-500">Rejected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Recent Investment Activity</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest investment transactions and updates
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {investments.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 5).map((investment, index) => (
                <div key={investment.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{investment.project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Investment by User {investment.investorId || 'Anonymous'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Amount: ₦{investment.amount.toLocaleString()}</span>
                        <span>Expected: ₦{investment.expectedReturn.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getInvestmentStatusBadge(investment.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Date: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                    <span>Payout: {new Date(investment.expectedPayoutDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {investments.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No investments yet</h3>
                  <p className="text-gray-600">Investment activity will appear here.</p>
                </div>
              )}
            </div>
            <Button variant="outline" asChild className="w-full mt-6">
              <Link to="/admin/investments" className="flex items-center justify-center">
                View All Investments
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};