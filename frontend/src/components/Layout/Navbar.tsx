import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogOut, User, Wallet, Menu, X, Home, TrendingUp, FileText, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'INVESTOR': return '/investor';
      case 'BUSINESS': return '/business';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'INVESTOR':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">Investor</Badge>;
      case 'BUSINESS':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">Business</Badge>;
      case 'ADMIN':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
      default:
        return null;
    }
  };

  const getNavigationItems = () => {
    if (!user) return [];
    
    const baseItems = [
      { name: 'Dashboard', href: getDashboardPath(), icon: Home },
    ];

    switch (user.role) {
      case 'INVESTOR':
        return [
          ...baseItems,
          { name: 'Projects', href: '/investor/projects', icon: TrendingUp },
          { name: 'Wallet', href: '/investor/wallet', icon: Wallet },
        ];
      case 'BUSINESS':
        return [
          ...baseItems,
          { name: 'My Projects', href: '/business/projects', icon: FileText },
          { name: 'Analytics', href: '/business/analytics', icon: TrendingUp },
        ];
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'Users', href: '/admin/users', icon: User },
          { name: 'Projects', href: '/admin/projects', icon: FileText },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              BizFundraiser
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {user && (
              <div className="flex items-center space-x-6">
                {getNavigationItems().map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Role Badge */}
                {getRoleBadge()}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100 rounded-xl px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center w-full">
                        <User className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">Profile</div>
                          <div className="text-xs text-gray-500">Manage your account</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'INVESTOR' && (
                      <DropdownMenuItem asChild>
                        <Link to="/investor/wallet" className="flex items-center w-full">
                          <Wallet className="mr-3 h-4 w-4" />
                          <div>
                            <div className="font-medium">Wallet</div>
                            <div className="text-xs text-gray-500">Manage your funds</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center w-full">
                        <Settings className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">Settings</div>
                          <div className="text-xs text-gray-500">Preferences & security</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <div>
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-gray-500">Sign out of your account</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                    {getRoleBadge()}
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {getNavigationItems().map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Mobile User Actions */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors duration-200"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    {user.role === 'INVESTOR' && (
                      <Link
                        to="/investor/wallet"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors duration-200"
                      >
                        <Wallet className="h-5 w-5" />
                        <span>Wallet</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Button variant="ghost" asChild className="w-full justify-start text-gray-600 hover:text-blue-600">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};