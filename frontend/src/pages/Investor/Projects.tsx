import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, TrendingUp, Building, DollarSign, Clock, Target, BarChart3, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { projectsAPI, investmentsAPI, walletAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Projects = () => {
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [roiRange, setRoiRange] = useState([0, 50]);
  const [durationFilter, setDurationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
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
  
  let filteredProjects = approvedProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesROI = p.projectedROI >= roiRange[0] && p.projectedROI <= roiRange[1];
    
    const matchesDuration = durationFilter === 'all' || 
      (durationFilter === 'short' && p.duration <= 6) ||
      (durationFilter === 'medium' && p.duration > 6 && p.duration <= 12) ||
      (durationFilter === 'long' && p.duration > 12);
    
    return matchesSearch && matchesROI && matchesDuration;
  });

  // Sort projects
  filteredProjects.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'roi-high':
        return b.projectedROI - a.projectedROI;
      case 'roi-low':
        return a.projectedROI - b.projectedROI;
      case 'funding-high':
        return b.fundingGoal - a.fundingGoal;
      case 'funding-low':
        return a.fundingGoal - b.fundingGoal;
      default:
        return 0;
    }
  });

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

  const getProjectStatus = (project: any) => {
    const progress = (project.currentFunding / project.fundingGoal) * 100;
    if (progress >= 100) return { status: 'Fully Funded', color: 'bg-green-100 text-green-800 border-green-200' };
    if (progress >= 75) return { status: 'Almost Funded', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (progress >= 50) return { status: 'Half Funded', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { status: 'Seeking Funding', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Investment Projects
              </h1>
              <p className="text-lg text-gray-600">
                Discover and invest in promising business opportunities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Target className="h-4 w-4 mr-2" />
                My Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search projects, businesses, or descriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl"
                />
              </div>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="roi-high">Highest ROI</SelectItem>
                  <SelectItem value="roi-low">Lowest ROI</SelectItem>
                  <SelectItem value="funding-high">Highest Funding</SelectItem>
                  <SelectItem value="funding-low">Lowest Funding</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 border-2 border-gray-200 hover:border-blue-500 rounded-xl"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">ROI Range</Label>
                    <div className="space-y-2">
                      <Slider
                        value={roiRange}
                        onValueChange={setRoiRange}
                        max={50}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{roiRange[0]}%</span>
                        <span>{roiRange[1]}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Duration</Label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="short">Short (≤6 months)</SelectItem>
                        <SelectItem value="medium">Medium (6-12 months)</SelectItem>
                        <SelectItem value="long">{"Long (>12 months)"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRoiRange([0, 50]);
                        setDurationFilter('all');
                        setSearch('');
                      }}
                      className="w-full h-10"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project, index) => {
            const projectStatus = getProjectStatus(project);
            return (
              <Card key={project.id} className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-gray-600">
                        <Building className="h-4 w-4" />
                        {project.businessName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {project.projectedROI}% ROI
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={projectStatus.color}>
                      {projectStatus.status}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.duration} months
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        Funding Goal
                      </span>
                      <span className="font-semibold text-gray-900">₦{project.fundingGoal.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        ₦{project.currentFunding.toLocaleString()} funded of ₦{project.fundingGoal.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">{project.projectedROI}%</div>
                        <div className="text-xs text-blue-700">Expected ROI</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-900">
                          ₦{(project.fundingGoal - project.currentFunding).toLocaleString()}
                        </div>
                        <div className="text-xs text-green-700">Remaining</div>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => setSelectedProject(project)}
                      >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Invest Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Invest in {selectedProject?.title}</DialogTitle>
                        <DialogDescription className="text-lg">
                          Enter the amount you want to invest in this project.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedProject && (
                        <div className="space-y-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-gray-600 font-medium">Business</Label>
                                <p className="font-semibold text-gray-900">{selectedProject.businessName}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 font-medium">Expected ROI</Label>
                                <p className="font-semibold text-emerald-600">{selectedProject.projectedROI}%</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 font-medium">Duration</Label>
                                <p className="font-semibold text-gray-900">{selectedProject.duration} months</p>
                              </div>
                              <div>
                                <Label className="text-gray-600 font-medium">Your Wallet Balance</Label>
                                <p className="font-semibold text-blue-600">₦{wallet?.balance?.toLocaleString() || '0'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                              Investment Amount (₦)
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(e.target.value)}
                              placeholder="Enter amount"
                              max={wallet?.balance || 0}
                              className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl"
                            />
                          </div>

                          {investmentAmount && parseFloat(investmentAmount) > 0 && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                              <h4 className="font-semibold text-gray-900 mb-4">Investment Summary</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">Investment Amount:</span>
                                  <span className="font-semibold text-lg">₦{parseFloat(investmentAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">Expected Return:</span>
                                  <span className="font-semibold text-lg text-green-600">
                                    ₦{calculateExpectedReturn(parseFloat(investmentAmount), selectedProject.projectedROI).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">Expected Profit:</span>
                                  <span className="font-semibold text-lg text-green-600">
                                    ₦{(calculateExpectedReturn(parseFloat(investmentAmount), selectedProject.projectedROI) - parseFloat(investmentAmount)).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <Button 
                            onClick={handleInvest}
                            disabled={!investmentAmount || investMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            {investMutation.isPending ? (
                              <div className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Processing...
                              </div>
                            ) : (
                              'Confirm Investment'
                            )}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-200/50">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                {search ? 'Try adjusting your search terms or filters.' : 'Check back later for new investment opportunities.'}
              </p>
              {search && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setRoiRange([0, 50]);
                    setDurationFilter('all');
                  }}
                  className="px-6 py-3"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};