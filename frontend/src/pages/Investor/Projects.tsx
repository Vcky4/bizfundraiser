import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, TrendingUp, Calendar, Building, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { projectsAPI, investmentsAPI, walletAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Projects = () => {
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getProjects,
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  });

  const investMutation = useMutation({
    mutationFn: ({ projectId, amount }: { projectId: string; amount: number }) =>
      investmentsAPI.invest(projectId, amount),
    onSuccess: () => {
      toast({
        title: 'Investment successful!',
        description: 'Your investment has been processed.',
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProject(null);
      setInvestmentAmount('');
    },
    onError: () => {
      toast({
        title: 'Investment failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const approvedProjects = projects.filter(p => p.status === 'APPROVED');
  const filteredProjects = approvedProjects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.businessName.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvest = () => {
    if (!selectedProject || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (amount <= 0 || amount > (wallet?.balance || 0)) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount within your wallet balance.',
        variant: 'destructive',
      });
      return;
    }

    investMutation.mutate({ 
      projectId: selectedProject.id, 
      amount 
    });
  };

  const calculateExpectedReturn = (amount: number, roi: number) => {
    return amount + (amount * roi / 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Projects</h1>
        <p className="text-gray-600">Discover and invest in promising business opportunities</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge variant="secondary">{project.projectedROI}% ROI</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {project.businessName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Goal
                  </span>
                  <span className="font-semibold">₦{project.fundingGoal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Duration
                  </span>
                  <span>{project.duration} months</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ₦{project.currentFunding.toLocaleString()} funded
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedProject(project)}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invest in {selectedProject?.title}</DialogTitle>
                      <DialogDescription>
                        Enter the amount you want to invest in this project.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedProject && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-600">Business</Label>
                            <p className="font-medium">{selectedProject.businessName}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Expected ROI</Label>
                            <p className="font-medium">{selectedProject.projectedROI}%</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Duration</Label>
                            <p className="font-medium">{selectedProject.duration} months</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Wallet Balance</Label>
                            <p className="font-medium">₦{wallet?.balance?.toLocaleString() || '0'}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Investment Amount (₦)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            placeholder="Enter amount"
                            max={wallet?.balance || 0}
                          />
                        </div>

                        {investmentAmount && parseFloat(investmentAmount) > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                              <span>Investment Amount:</span>
                              <span className="font-semibold">₦{parseFloat(investmentAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Expected Return:</span>
                              <span className="font-semibold text-green-600">
                                ₦{calculateExpectedReturn(parseFloat(investmentAmount), selectedProject.projectedROI).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Profit:</span>
                              <span className="font-semibold text-green-600">
                                ₦{(calculateExpectedReturn(parseFloat(investmentAmount), selectedProject.projectedROI) - parseFloat(investmentAmount)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        <Button 
                          onClick={handleInvest}
                          disabled={!investmentAmount || investMutation.isPending}
                          className="w-full"
                        >
                          {investMutation.isPending ? 'Processing...' : 'Confirm Investment'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {search ? 'Try adjusting your search terms.' : 'Check back later for new investment opportunities.'}
          </p>
        </div>
      )}
    </div>
  );
};