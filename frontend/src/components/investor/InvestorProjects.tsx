import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Building2,
  Eye,
  Target,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { projectsApi, investmentsApi, walletsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ProjectStatus } from '@/types';

const InvestorProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', { search: searchTerm, status: statusFilter }],
    queryFn: () => projectsApi.getProjects({ 
      search: searchTerm || undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      limit: '50'
    }),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletsApi.getWallet(),
  });

  const investMutation = useMutation({
    mutationFn: (data: { projectId: string; amount: number }) => 
      investmentsApi.createInvestment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setInvestmentAmount('');
      setIsInvestDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: 'Investment Successful',
        description: 'Your investment has been processed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Investment Failed',
        description: error.response?.data?.message || 'Failed to process investment.',
        variant: 'destructive',
      });
    },
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

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid investment amount.',
        variant: 'destructive',
      });
      return;
    }
    if (amount > (wallet?.balance || 0)) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough funds for this investment.',
        variant: 'destructive',
      });
      return;
    }
    if (amount > (selectedProject?.amountRequested - selectedProject?.amountRaised)) {
      toast({
        title: 'Investment Too Large',
        description: 'Investment amount exceeds remaining project funding.',
        variant: 'destructive',
      });
      return;
    }
    investMutation.mutate({ 
      projectId: selectedProject.id, 
      amount 
    });
  };

  const filteredProjects = projects?.projects?.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.business?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (projectsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Investment Projects</h1>
          <p className="text-muted-foreground">
            Discover and invest in promising business opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredProjects?.length || 0} projects available
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ALL')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === ProjectStatus.APPROVED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ProjectStatus.APPROVED)}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === ProjectStatus.FUNDED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ProjectStatus.FUNDED)}
              >
                Funded
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                  <CardDescription className="mt-1">
                    by {project.business?.businessName || 'Business'}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Funding Goal</span>
                  <span className="font-medium">{formatCurrency(project.amountRequested)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Raised</span>
                  <span className="font-medium">{formatCurrency(project.amountRaised)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected ROI</span>
                  <span className="font-medium text-green-600">
                    {formatPercentage(project.expectedROI)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{project.duration} months</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{getProgressPercentage(project).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(project)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsInvestDialogOpen(true);
                  }}
                  disabled={project.status !== ProjectStatus.APPROVED || project.amountRaised >= project.amountRequested}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Invest
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredProjects || filteredProjects.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No projects are currently available for investment.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Investment Dialog */}
      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in Project</DialogTitle>
            <DialogDescription>
              {selectedProject?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Project Goal:</span>
                <span className="font-medium">{formatCurrency(selectedProject?.amountRequested || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount Raised:</span>
                <span className="font-medium">{formatCurrency(selectedProject?.amountRaised || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className="font-medium">
                  {formatCurrency((selectedProject?.amountRequested || 0) - (selectedProject?.amountRaised || 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expected ROI:</span>
                <span className="font-medium text-green-600">
                  {formatPercentage(selectedProject?.expectedROI || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span className="font-medium">{selectedProject?.duration || 0} months</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-amount">Investment Amount (USD)</Label>
              <Input
                id="investment-amount"
                type="number"
                placeholder="0.00"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min="0"
                max={(selectedProject?.amountRequested || 0) - (selectedProject?.amountRaised || 0)}
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Available balance: {formatCurrency(wallet?.balance || 0)}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleInvest}
                disabled={investMutation.isPending}
              >
                {investMutation.isPending ? 'Processing...' : 'Invest'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorProjects;