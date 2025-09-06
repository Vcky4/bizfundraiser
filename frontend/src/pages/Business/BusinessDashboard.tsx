import { useQuery } from '@tanstack/react-query';
import { Plus, FileText, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  
  const totalFundingRequested = myProjects.reduce((sum, p) => sum + p.fundingGoal, 0);
  const totalFundingReceived = myProjects.reduce((sum, p) => sum + p.currentFunding, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'FUNDED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Funded</Badge>;
      case 'REPAID':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Repaid</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="text-gray-600">Manage your funding projects and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingProjects.length} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funding Requested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalFundingRequested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funding Received</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalFundingReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {fundedProjects.length} funded projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProjects.length + fundedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Approved or funded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your funding projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/business/projects/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Submit New Project
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/business/projects">View All Projects</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest funding applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span>Goal: ₦{project.fundingGoal.toLocaleString()}</span>
                    <span>Duration: {project.duration} months</span>
                  </div>
                  {project.status === 'APPROVED' && (
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        ₦{project.currentFunding.toLocaleString()} funded ({Math.round((project.currentFunding / project.fundingGoal) * 100)}%)
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {myProjects.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-4">Submit your first funding application to get started.</p>
                  <Button asChild>
                    <Link to="/business/projects/new">Submit Project</Link>
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