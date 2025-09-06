import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  Building2,
  Home,
  Wallet,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  User,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: `/${userRole.toLowerCase()}`, icon: Home },
    ];

    if (userRole === UserRole.INVESTOR) {
      return [
        ...baseItems,
        { name: 'Wallet', href: `/${userRole.toLowerCase()}/wallet`, icon: Wallet },
        { name: 'Projects', href: `/${userRole.toLowerCase()}/projects`, icon: TrendingUp },
        { name: 'Investments', href: `/${userRole.toLowerCase()}/investments`, icon: FileText },
      ];
    } else if (userRole === UserRole.BUSINESS) {
      return [
        ...baseItems,
        { name: 'My Projects', href: `/${userRole.toLowerCase()}/projects`, icon: FileText },
        { name: 'Wallet', href: `/${userRole.toLowerCase()}/wallet`, icon: Wallet },
        { name: 'Analytics', href: `/${userRole.toLowerCase()}/analytics`, icon: TrendingUp },
      ];
    } else if (userRole === UserRole.ADMIN) {
      return [
        ...baseItems,
        { name: 'Projects', href: `/${userRole.toLowerCase()}/projects`, icon: FileText },
        { name: 'Users', href: `/${userRole.toLowerCase()}/users`, icon: User },
        { name: 'Analytics', href: `/${userRole.toLowerCase()}/analytics`, icon: TrendingUp },
        { name: 'Settings', href: `/${userRole.toLowerCase()}/settings`, icon: Settings },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold">BizFundraiser</span>
              </div>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center px-4 py-6">
            <Building2 className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">BizFundraiser</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <h1 className="text-2xl font-semibold text-gray-900 ml-2 md:ml-0">
                {navigationItems.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.idDocument} alt={user?.firstName} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${userRole.toLowerCase()}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/${userRole.toLowerCase()}/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;