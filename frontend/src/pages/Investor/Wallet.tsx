import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet as WalletIcon, Plus, Minus, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { walletAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Wallet = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletAPI.getWallet,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: walletAPI.getTransactions,
  });

  const depositMutation = useMutation({
    mutationFn: (amount: number) => walletAPI.deposit(amount),
    onSuccess: () => {
      toast({
        title: 'Deposit successful!',
        description: 'Your wallet has been credited.',
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDepositAmount('');
    },
    onError: () => {
      toast({
        title: 'Deposit failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (amount: number) => walletAPI.withdraw(amount),
    onSuccess: () => {
      toast({
        title: 'Withdrawal successful!',
        description: 'Your withdrawal is being processed.',
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setWithdrawAmount('');
    },
    onError: () => {
      toast({
        title: 'Withdrawal failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }
    depositMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > (wallet?.balance || 0)) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount within your balance.',
        variant: 'destructive',
      });
      return;
    }
    withdrawMutation.mutate(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'INVESTMENT':
        return <Minus className="h-4 w-4 text-blue-500" />;
      case 'PAYOUT':
        return <Plus className="h-4 w-4 text-green-500" />;
      default:
        return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'PAYOUT':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'INVESTMENT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600">Manage your funds and view transaction history</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-6 w-6" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Your available balance for investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600 mb-6">
            ₦{wallet?.balance?.toLocaleString() || '0.00'}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
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
                  <div>
                    <Label htmlFor="depositAmount">Amount (₦)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <Button 
                    onClick={handleDeposit}
                    disabled={!depositAmount || depositMutation.isPending}
                    className="w-full"
                  >
                    {depositMutation.isPending ? 'Processing...' : 'Deposit'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Minus className="h-4 w-4" />
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
                  <div>
                    <Label htmlFor="withdrawAmount">Amount (₦)</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={wallet?.balance || 0}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available: ₦{wallet?.balance?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Button 
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || withdrawMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-6 w-6" />
            Transaction History
          </CardTitle>
          <CardDescription>View all your wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'DEPOSIT' || transaction.type === 'PAYOUT' ? '+' : '-'}
                    ₦{transaction.amount.toLocaleString()}
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">Your transaction history will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};