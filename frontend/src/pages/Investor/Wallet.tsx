import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownLeft, Plus, Wallet as WalletIcon, TrendingUp, History, Search, Download, Eye, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { walletAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Wallet = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wallet, isLoading } = useQuery({
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
        description: 'Your wallet has been funded.',
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDepositAmount('');
      setIsDepositOpen(false);
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
        description: 'Your withdrawal has been processed.',
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setWithdrawAmount('');
      setIsWithdrawOpen(false);
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
    if (!depositAmount) return;
    
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
    if (!withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > (wallet?.balance || 0)) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount within your wallet balance.',
        variant: 'destructive',
      });
      return;
    }

    withdrawMutation.mutate(amount);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'INVESTMENT':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'PAYOUT':
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
      default:
        return <WalletIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'WITHDRAWAL':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'INVESTMENT':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PAYOUT':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Wallet
              </h1>
              <p className="text-lg text-gray-600">
                Manage your funds and view transaction history
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Eye className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Wallet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <WalletIcon className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₦{wallet?.balance?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-500">
                Available for investment
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₦0
              </div>
              <p className="text-sm text-gray-500">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Returns</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₦0
              </div>
              <p className="text-sm text-gray-500">
                From investments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-5 w-5" />
                    Deposit Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Deposit Funds</DialogTitle>
                    <DialogDescription className="text-lg">
                      Add money to your wallet to start investing.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount" className="text-sm font-semibold text-gray-700">Amount (₦)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-green-500 focus:ring-0 rounded-xl"
                      />
                    </div>

                    <Button 
                      onClick={handleDeposit}
                      disabled={!depositAmount || depositMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {depositMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Deposit Funds'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 border-2 border-gray-200 hover:border-red-500 text-red-600 hover:text-red-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <ArrowUpRight className="h-5 w-5" />
                    Withdraw Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Withdraw Funds</DialogTitle>
                    <DialogDescription className="text-lg">
                      Withdraw money from your wallet to your bank account.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount" className="text-sm font-semibold text-gray-700">Amount (₦)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={wallet?.balance || 0}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-red-500 focus:ring-0 rounded-xl"
                      />
                      <p className="text-sm text-gray-500">
                        Available: ₦{wallet?.balance?.toLocaleString() || '0'}
                      </p>
                    </div>

                    <Button 
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || withdrawMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {withdrawMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Withdraw Funds'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <History className="h-6 w-6" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  View all your wallet transactions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Bar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="DEPOSIT">Deposits</SelectItem>
                    <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                    <SelectItem value="INVESTMENT">Investments</SelectItem>
                    <SelectItem value="PAYOUT">Returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-2xl p-12">
                  <WalletIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No transactions found</h3>
                  <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'Try adjusting your search terms or filters.' 
                      : 'Your transaction history will appear here once you start using your wallet.'
                    }
                  </p>
                  {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setTypeFilter('all');
                      }}
                      className="px-6 py-3"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white/50 backdrop-blur-sm animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border-2 ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{transaction.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(transaction.createdAt)}
                          </p>
                          <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              {transaction.status}
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getTransactionColor(transaction.type).split(' ')[0]}`}>
                        {transaction.type === 'DEPOSIT' || transaction.type === 'PAYOUT' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.type.toLowerCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};