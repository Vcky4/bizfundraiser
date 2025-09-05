import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  HomeIcon, 
  UserIcon, 
  WalletIcon, 
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
]

const investorNavigation = [
  { name: 'My Investments', href: '/dashboard/investor', icon: ChartBarIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
]

const businessNavigation = [
  { name: 'My Projects', href: '/dashboard/business', icon: BuildingOfficeIcon },
  { name: 'Create Project', href: '/dashboard/create-project', icon: ChartBarIcon },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/dashboard/admin', icon: CogIcon },
  { name: 'All Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Pending Projects', href: '/dashboard/pending', icon: BuildingOfficeIcon },
]

export const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getRoleNavigation = () => {
    switch (user?.role) {
      case 'INVESTOR':
        return investorNavigation
      case 'BUSINESS':
        return businessNavigation
      case 'ADMIN':
        return adminNavigation
      default:
        return []
    }
  }

  const allNavigation = [...navigation, ...getRoleNavigation()]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">BizFundraiser</h1>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {allNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                  />
                  {item.name}
                </a>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}