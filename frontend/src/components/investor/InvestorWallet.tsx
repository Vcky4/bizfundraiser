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
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { walletsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const InvestorWallet: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletsApi.getWallet(),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletsApi.getTransactions({ limit: '20' }),
  });

  const depositMutation = useMutation({
    mutationFn: (data: { amount: number; description?: string }) => 
      walletsApi.deposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDepositAmount('');
      setDepositDescription('');
      setIsDepositOpen(false);
      toast({
        title: 'Deposit Successful',
        description: 'Your wallet has been funded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Deposit Failed',
        description: error.response?.data?.message || 'Failed to process deposit.',
        variant: 'destructive',
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; description?: string }) => 
      walletsApi.withdraw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setWithdrawAmount('');
      setWithdrawDescription('');
      setIsWithdrawOpen(false);
      toast({
        title: 'Withdrawal Successful',
        description: 'Your withdrawal has been processed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Withdrawal Failed',
        description: error.response?.data?.message || 'Failed to process withdrawal.',
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

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid deposit amount.',
        variant: 'destructive',
      });
      return;
    }
    depositMutation.mutate({ 
      amount, 
      description: depositDescription || undefined 
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount.',
        variant: 'destructive',
      });
      return;
    }
    if (amount > (wallet?.balance || 0)) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough funds for this withdrawal.',
        variant: 'destructive',
      });
      return;
    }
    withdrawMutation.mutate({ 
      amount, 
      description: withdrawDescription || undefined 
    });
  };

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
              Available for investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                transactions?.transactions
                  ?.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
                  ?.reduce((sum, t) => sum + t.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(
                transactions?.transactions
                  ?.filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
                  ?.reduce((sum, t) => sum + t.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Deposit Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>
                Add money to your wallet to start investing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (USD)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-description">Description (Optional)</Label>
                <Textarea
                  id="deposit-description"
                  placeholder="Add a note about this deposit..."
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDepositOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeposit}
                  disabled={depositMutation.isPending}
                >
                  {depositMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Deposit'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Minus className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Withdraw money from your wallet to your bank account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  max={wallet?.balance || 0}
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Available balance: {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw-description">Description (Optional)</Label>
                <Textarea
                  id="withdraw-description"
                  placeholder="Add a note about this withdrawal..."
                  value={withdrawDescription}
                  onChange={(e) => setWithdrawDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdraw}
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Withdraw'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  ) : (
                    <RefreshCw className="h-5 w-5 text-blue-500" />
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
                      transaction.type === 'WITHDRAWAL' ? 'text-red-600' : 
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

export default InvestorWallet;