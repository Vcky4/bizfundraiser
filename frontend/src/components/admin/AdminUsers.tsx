import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  Mail, 
  Phone,
  Building2,
  User,
  Shield,
  Calendar
} from 'lucide-react';
import { usersApi } from '@/services/api';
import { UserRole } from '@/types';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAllUsers(),
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.BUSINESS:
        return 'bg-blue-100 text-blue-800';
      case UserRole.INVESTOR:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4" />;
      case UserRole.BUSINESS:
        return <Building2 className="h-4 w-4" />;
      case UserRole.INVESTOR:
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (usersLoading) {
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users and their accounts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredUsers?.length || 0} users
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('ALL')}
              >
                All
              </Button>
              <Button
                variant={roleFilter === UserRole.INVESTOR ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(UserRole.INVESTOR)}
              >
                Investors
              </Button>
              <Button
                variant={roleFilter === UserRole.BUSINESS ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(UserRole.BUSINESS)}
              >
                Businesses
              </Button>
              <Button
                variant={roleFilter === UserRole.ADMIN ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(UserRole.ADMIN)}
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers?.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {user.businessName || user.email}
                  </CardDescription>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1">{user.role}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>

              {user.businessName && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">Business Information</h4>
                  <p className="text-sm text-muted-foreground">{user.businessName}</p>
                  {user.cacNumber && (
                    <p className="text-xs text-muted-foreground">CAC: {user.cacNumber}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={user.kycCompleted ? 'default' : 'outline'}>
                  {user.kycCompleted ? 'KYC Verified' : 'KYC Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredUsers || filteredUsers.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm || roleFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No users are currently registered on the platform.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUsers;