import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Calendar,
  Target,
  FileText,
  Filter
} from 'lucide-react';
import { investmentsApi } from '@/services/api';

const InvestorInvestments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments', { search: searchTerm, status: statusFilter }],
    queryFn: () => investmentsApi.getInvestments({ 
      limit: '50'
    }),
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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'FUNDED':
        return 'bg-blue-100 text-blue-800';
      case 'REPAID':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateExpectedReturn = (investment: any) => {
    return investment.amount * (1 + investment.expectedReturn / 100);
  };

  const calculateActualReturn = (investment: any) => {
    return investment.actualReturn || 0;
  };

  const filteredInvestments = investments?.investments?.filter((investment) => {
    const matchesSearch = investment.project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.project?.business?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && investment.isActive) ||
                         (statusFilter === 'COMPLETED' && !investment.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalInvested = filteredInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const totalExpectedReturn = filteredInvestments?.reduce((sum, inv) => sum + calculateExpectedReturn(inv), 0) || 0;
  const totalActualReturn = filteredInvestments?.reduce((sum, inv) => sum + calculateActualReturn(inv), 0) || 0;
  const activeInvestments = filteredInvestments?.filter(inv => inv.isActive).length || 0;

  if (investmentsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold">My Investments</h1>
          <p className="text-muted-foreground">
            Track your investment portfolio and returns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredInvestments?.length || 0} investments
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestments}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalExpectedReturn)}
            </div>
            <p className="text-xs text-muted-foreground">Projected total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Returns</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalActualReturn)}
            </div>
            <p className="text-xs text-muted-foreground">Received so far</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search investments..."
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
                variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ACTIVE')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('COMPLETED')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investments List */}
      <div className="space-y-4">
        {filteredInvestments?.map((investment) => (
          <Card key={investment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {investment.project?.title || 'Project'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {investment.project?.business?.businessName || 'Business'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(investment.isActive)}>
                        {investment.isActive ? 'Active' : 'Completed'}
                      </Badge>
                      <Badge variant="outline" className={getProjectStatusColor(investment.project?.status || '')}>
                        {investment.project?.status || 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investment Amount</p>
                      <p className="font-medium">{formatCurrency(investment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Return</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(calculateExpectedReturn(investment))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Actual Return</p>
                      <p className="font-medium text-blue-600">
                        {formatCurrency(calculateActualReturn(investment))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROI</p>
                      <p className="font-medium">
                        {formatPercentage(investment.expectedReturn)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invested Date</p>
                      <p className="font-medium">{formatDate(investment.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Project Duration</p>
                      <p className="font-medium">{investment.project?.duration || 0} months</p>
                    </div>
                    {investment.repaidAt && (
                      <div>
                        <p className="text-muted-foreground">Repaid Date</p>
                        <p className="font-medium">{formatDate(investment.repaidAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:items-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Project Status</p>
                    <p className="font-medium capitalize">
                      {investment.project?.status?.toLowerCase().replace('_', ' ') || 'Unknown'}
                    </p>
                  </div>
                  {investment.isActive && (
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Project
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredInvestments || filteredInvestments.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No investments found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t made any investments yet. Start by browsing available projects.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestorInvestments;