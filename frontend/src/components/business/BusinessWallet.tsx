import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { walletsApi } from '@/services/api';

const BusinessWallet: React.FC = () => {
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletsApi.getWallet(),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletsApi.getTransactions({ limit: '20' }),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDeposits = transactions?.transactions
    ?.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalWithdrawals = transactions?.transactions
    ?.filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalRepayments = transactions?.transactions
    ?.filter(t => t.type === 'REPAYMENT' && t.status === 'COMPLETED')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  if (walletLoading || transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(wallet?.balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding Received</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalDeposits)}
            </div>
            <p className="text-xs text-muted-foreground">
              From project funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repayments</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalRepayments)}
            </div>
            <p className="text-xs text-muted-foreground">
              To investors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent wallet transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.transactions?.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {transaction.type === 'DEPOSIT' ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : transaction.type === 'WITHDRAWAL' ? (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  ) : transaction.type === 'REPAYMENT' ? (
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium capitalize">
                      {transaction.type.toLowerCase().replace('_', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'DEPOSIT' ? 'text-green-600' : 
                      transaction.type === 'WITHDRAWAL' || transaction.type === 'REPAYMENT' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {(!transactions?.transactions || transactions.transactions.length === 0) && (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">
                  Your transaction history will appear here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessWallet;