import { useQuery } from '@tanstack/react-query';
import { Plus, FileText, TrendingUp, Clock, DollarSign, Target, ArrowUpRight, Eye, BarChart3, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { projectsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const BusinessDashboard = () => {
  const { user } = useAuth();
  
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getProjects,
  });

  // Filter projects for current business
  const myProjects = projects.filter(p => p.businessId === user?.id);
  const pendingProjects = myProjects.filter(p => p.status === 'PENDING');
  const approvedProjects = myProjects.filter(p => p.status === 'APPROVED');
  const fundedProjects = myProjects.filter(p => p.status === 'FUNDED');
  const rejectedProjects = myProjects.filter(p => p.status === 'REJECTED');
  
  const totalFundingRequested = myProjects.reduce((sum, p) => sum + p.fundingGoal, 0);
  const totalFundingReceived = myProjects.reduce((sum, p) => sum + p.currentFunding, 0);
  const successRate = myProjects.length > 0 ? Math.round((approvedProjects.length + fundedProjects.length) / myProjects.length * 100) : 0;

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

  const stats = [
    {
      title: 'Total Projects',
      value: myProjects.length,
      change: '+2 this month',
      changeType: 'positive',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${pendingProjects.length} pending approval`,
    },
    {
      title: 'Funding Requested',
      value: `₦${totalFundingRequested.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Across all projects',
    },
    {
      title: 'Funding Received',
      value: `₦${totalFundingReceived.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${fundedProjects.length} funded projects`,
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      change: successRate > 70 ? 'Excellent' : successRate > 50 ? 'Good' : 'Needs improvement',
      changeType: successRate > 70 ? 'positive' : successRate > 50 ? 'neutral' : 'warning',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Project approval rate',
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
                Business Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your funding projects and track performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/business/projects/new" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
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
          {/* Quick Actions */}
          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your funding projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/business/projects/new" className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  Submit New Project
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-12">
                <Link to="/business/projects" className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5" />
                  View All Projects
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-12">
                <Link to="/business/analytics" className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Project Overview */}
          <Card className="xl:col-span-2 card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Project Overview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Track your project performance
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  {myProjects.length} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Project Status Breakdown */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">{pendingProjects.length}</div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{approvedProjects.length}</div>
                    <div className="text-sm text-blue-700">Approved</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{fundedProjects.length}</div>
                    <div className="text-sm text-green-700">Funded</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{rejectedProjects.length}</div>
                    <div className="text-sm text-red-700">Rejected</div>
                  </div>
                </div>

                {/* Success Rate Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Success Rate</span>
                    <span className="text-sm font-bold text-gray-900">{successRate}%</span>
                  </div>
                  <Progress value={successRate} className="h-3" />
                  <p className="text-xs text-gray-500">
                    {successRate > 70 ? 'Excellent performance!' : 
                     successRate > 50 ? 'Good progress' : 'Room for improvement'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Recent Projects</CardTitle>
                <CardDescription className="text-gray-600">
                  Your latest funding applications
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/business/projects" className="flex items-center space-x-2">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.slice(0, 5).map((project, index) => (
                <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.description?.substring(0, 100)}...</p>
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
                  
                  {project.status === 'APPROVED' && (
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
                        ₦{project.currentFunding.toLocaleString()} funded of ₦{project.fundingGoal.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {myProjects.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Submit your first funding application to get started and begin raising capital for your business.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link to="/business/projects/new" className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Submit Your First Project</span>
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