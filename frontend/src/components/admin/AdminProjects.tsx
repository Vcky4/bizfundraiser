import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Eye,
  DollarSign,
  Calendar,
  Target,
  FileText,
  RefreshCw
} from 'lucide-react';
import { projectsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ProjectStatus } from '@/types';
import type { ApproveProjectRequest } from '@/types';

const AdminProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'approve' | 'reject'>('approve');
  const [approvalReason, setApprovalReason] = useState('');
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

  const { data: pendingProjects } = useQuery({
    queryKey: ['pending-projects'],
    queryFn: () => projectsApi.getPendingProjects(),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveProjectRequest }) => 
      projectsApi.approveProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['pending-projects'] });
      setIsApproveDialogOpen(false);
      setSelectedProject(null);
      setApprovalReason('');
      toast({
        title: 'Project Decision Made',
        description: `Project has been ${approvalDecision}d successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Decision Failed',
        description: error.response?.data?.message || 'Failed to process decision.',
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

  const handleApprove = () => {
    if (!selectedProject) return;
    approveMutation.mutate({ 
      id: selectedProject.id, 
      data: { 
        decision: approvalDecision, 
        reason: approvalReason || undefined 
      } 
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
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            Review and manage all project submissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {pendingProjects?.length || 0} pending approval
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                variant={statusFilter === ProjectStatus.PENDING ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ProjectStatus.PENDING)}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === ProjectStatus.APPROVED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ProjectStatus.APPROVED)}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === ProjectStatus.REJECTED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ProjectStatus.REJECTED)}
              >
                Rejected
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
                  <span className="text-muted-foreground">Amount Requested</span>
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Funding Progress</span>
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
                {project.status === ProjectStatus.PENDING && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProject(project);
                        setApprovalDecision('approve');
                        setIsApproveDialogOpen(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProject(project);
                        setApprovalDecision('reject');
                        setIsApproveDialogOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
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
                : 'No projects are currently available.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Approval Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDecision === 'approve' ? 'Approve Project' : 'Reject Project'}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount Requested:</span>
                <span className="font-medium">{formatCurrency(selectedProject?.amountRequested || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expected ROI:</span>
                <span className="font-medium">{formatPercentage(selectedProject?.expectedROI || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span className="font-medium">{selectedProject?.duration || 0} months</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                {approvalDecision === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
              </Label>
              <Textarea
                id="reason"
                placeholder={
                  approvalDecision === 'approve' 
                    ? 'Add any notes about this approval...'
                    : 'Please provide a reason for rejection...'
                }
                value={approvalReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={approveMutation.isPending || (approvalDecision === 'reject' && !approvalReason.trim())}
                variant={approvalDecision === 'reject' ? 'destructive' : 'default'}
              >
                {approveMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `${approvalDecision === 'approve' ? 'Approve' : 'Reject'} Project`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;