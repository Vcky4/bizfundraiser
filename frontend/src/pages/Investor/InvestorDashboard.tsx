import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { walletAPI, projectsAPI, investmentsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';

export const InvestorDashboard = () => {
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getProjects,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ['investments'],
    queryFn: investmentsAPI.getInvestments,
  });

  const approvedProjects = projects.filter(p => p.status === 'APPROVED');
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const expectedReturns = investments.reduce((sum, inv) => sum + inv.expectedReturn, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
        <p className="text-gray-600">Manage your investments and explore new opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{wallet?.balance?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Available for investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {investments.length} investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{expectedReturns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From active investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Projects</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for investment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
            <CardDescription>
              Discover new investment opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge variant="secondary">{project.projectedROI}% ROI</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.businessName}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Goal: ₦{project.fundingGoal.toLocaleString()}</span>
                    <span>Duration: {project.duration} months</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ₦{project.currentFunding.toLocaleString()} funded
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="w-full mt-4">
              <Link to="/investor/projects">View All Projects</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Investments */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
            <CardDescription>
              Track your investment performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 3).map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{investment.project.title}</h3>
                    <Badge 
                      variant={investment.status === 'ACTIVE' ? 'default' : 'secondary'}
                    >
                      {investment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Invested: ₦{investment.amount.toLocaleString()}</span>
                    <span>Expected: ₦{investment.expectedReturn.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Payout: {new Date(investment.expectedPayoutDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {investments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No investments yet</p>
              )}
            </div>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/investor/investments">View All Investments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};