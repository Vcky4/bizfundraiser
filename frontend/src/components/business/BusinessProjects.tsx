import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
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
import type { CreateProjectRequest } from '@/types';

const BusinessProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: '',
    description: '',
    amountRequested: 0,
    duration: 0,
    expectedROI: 0,
    documents: []
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectsApi.getMyProjects(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      setFormData({
        title: '',
        description: '',
        amountRequested: 0,
        duration: 0,
        expectedROI: 0,
        documents: []
      });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Project Created',
        description: 'Your project has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.response?.data?.message || 'Failed to create project.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProjectRequest> }) => 
      projectsApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: 'Project Updated',
        description: 'Your project has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update project.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      toast({
        title: 'Project Deleted',
        description: 'Your project has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion Failed',
        description: error.response?.data?.message || 'Failed to delete project.',
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

  const handleCreate = () => {
    if (!formData.title || !formData.description || formData.amountRequested <= 0 || formData.duration <= 0 || formData.expectedROI <= 0) {
      toast({
        title: 'Invalid Data',
        description: 'Please fill in all required fields with valid values.',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      amountRequested: project.amountRequested,
      duration: project.duration,
      expectedROI: project.expectedROI,
      documents: project.documents || []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProject) return;
    updateMutation.mutate({ id: selectedProject.id, data: formData });
  };

  const handleDelete = (project: any) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(project.id);
    }
  };

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">
            Manage your project funding applications
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Submit a new project for funding consideration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Requested (USD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={formData.amountRequested || ''}
                    onChange={(e) => setFormData({ ...formData, amountRequested: parseFloat(e.target.value) || 0 })}
                    min="1000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="0"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roi">Expected ROI (%) *</Label>
                  <Input
                    id="roi"
                    type="number"
                    placeholder="0"
                    value={formData.expectedROI || ''}
                    onChange={(e) => setFormData({ ...formData, expectedROI: parseFloat(e.target.value) || 0 })}
                    min="5"
                    max="50"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                    Created {formatDate(project.createdAt)}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(project)}
                  disabled={project.status === ProjectStatus.FUNDED || project.status === ProjectStatus.REPAID}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project)}
                  disabled={project.status === ProjectStatus.FUNDED || project.status === ProjectStatus.REPAID}
                >
                  <Trash2 className="h-4 w-4" />
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
                : 'You haven\'t created any projects yet. Create your first project to get started.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount Requested (USD) *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  placeholder="0"
                  value={formData.amountRequested || ''}
                  onChange={(e) => setFormData({ ...formData, amountRequested: parseFloat(e.target.value) || 0 })}
                  min="1000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Project Description *</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your project in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (months) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="0"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="1"
                  max="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-roi">Expected ROI (%) *</Label>
                <Input
                  id="edit-roi"
                  type="number"
                  placeholder="0"
                  value={formData.expectedROI || ''}
                  onChange={(e) => setFormData({ ...formData, expectedROI: parseFloat(e.target.value) || 0 })}
                  min="5"
                  max="50"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Project'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessProjects;