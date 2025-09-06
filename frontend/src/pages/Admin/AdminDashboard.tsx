import { useQuery } from '@tanstack/react-query';
import { Users, FileText, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsAPI, investmentsAPI, usersAPI } from '@/lib/api';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { data: projects = [] } = useQuery({
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

  const pendingProjects = projects.filter(p => p.status === 'PENDING');
  const approvedProjects = projects.filter(p => p.status === 'APPROVED');
  const fundedProjects = projects.filter(p => p.status === 'FUNDED');
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const unverifiedUsers = users.filter(u => !u.isVerified);

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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform activity and manage approvals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {unverifiedUsers.length} unverified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingProjects.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Projects awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Approved for funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalInvestments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {investments.length} investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funded Projects</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fundedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Fully funded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Project Approvals</CardTitle>
            <CardDescription>
              Projects waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProjects.slice(0, 5).map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.businessName}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Goal: ₦{project.fundingGoal.toLocaleString()}</span>
                    <span>ROI: {project.projectedROI}%</span>
                  </div>
                </div>
              ))}
              {pendingProjects.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending approvals</p>
              )}
            </div>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/admin/projects">Review All Projects</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>
              Latest investment activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 5).map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{investment.project.title}</h3>
                      <p className="text-sm text-gray-600">Investment</p>
                    </div>
                    <Badge 
                      variant={investment.status === 'ACTIVE' ? 'default' : 'secondary'}
                    >
                      {investment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Amount: ₦{investment.amount.toLocaleString()}</span>
                    <span>{new Date(investment.investmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {investments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No investments yet</p>
              )}
            </div>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/admin/investments">View All Investments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};