import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TrendingUpIcon,
  WalletIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { walletService } from '../services/walletService'
import { investmentService } from '../services/investmentService'
import { projectService } from '../services/projectService'
import { Link } from 'react-router-dom'

export const InvestorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch wallet data
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletService.getWallet(),
  })

  // Fetch investment stats
  const { data: investmentStats, isLoading: statsLoading } = useQuery({
    queryKey: ['investment-stats'],
    queryFn: () => investmentService.getInvestmentStats(),
  })

  // Fetch recent investments
  const { data: investmentsData, isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments', { limit: 5 }],
    queryFn: () => investmentService.getInvestments({ limit: 5 }),
  })

  // Fetch available projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', { status: 'approved', limit: 6 }],
    queryFn: () => projectService.getProjects({ status: 'approved', limit: 6 }),
  })

  const wallet = walletData?.data
  const stats = investmentStats?.data
  const investments = investmentsData?.data?.data || []
  const projects = projectsData?.data?.data || []

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'investments', name: 'My Investments', icon: TrendingUpIcon },
    { id: 'wallet', name: 'Wallet', icon: WalletIcon },
    { id: 'projects', name: 'Available Projects', icon: EyeIcon },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
        <p className="text-gray-600">Manage your investments and discover new opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WalletIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {walletLoading ? '...' : formatCurrency(Number(wallet?.balance || 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUpIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : formatCurrency(Number(stats?.totalInvested || 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Investments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.activeInvestments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Expected Returns</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : formatCurrency(Number(stats?.totalExpectedReturn || 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Investments */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Recent Investments</h3>
              </div>
              <div className="space-y-4">
                {investmentsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : investments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUpIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No investments yet</p>
                    <p className="text-sm">Start investing in projects to see them here</p>
                  </div>
                ) : (
                  investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{investment.project?.title}</h4>
                        <p className="text-sm text-gray-500">
                          Invested: {formatCurrency(Number(investment.amount))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-success-600">
                          Expected: {formatCurrency(Number(investment.expectedReturn))}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPercentage(Number(investment.expectedReturn) / Number(investment.amount) * 100)} ROI
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Available Projects */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Featured Projects</h3>
                <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-500">
                  View all projects
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projectsLoading ? (
                  <div className="col-span-full text-center py-4">Loading...</div>
                ) : projects.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No projects available</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Goal:</span>
                          <span className="font-medium">{formatCurrency(Number(project.amountRequested))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Raised:</span>
                          <span className="font-medium">{formatCurrency(Number(project.amountRaised))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">ROI:</span>
                          <span className="font-medium text-success-600">{formatPercentage(Number(project.expectedROI))}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(Number(project.amountRaised) / Number(project.amountRequested)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        to={`/projects/${project.id}`}
                        className="mt-3 w-full btn-primary text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">My Investments</h3>
            </div>
            <div className="space-y-4">
              {investmentsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : investments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUpIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No investments yet</p>
                  <p className="text-sm">Start investing in projects to see them here</p>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expected Return
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {investments.map((investment) => (
                        <tr key={investment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {investment.project?.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {investment.project?.business?.businessName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(Number(investment.amount))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600">
                            {formatCurrency(Number(investment.expectedReturn))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              investment.isActive 
                                ? 'bg-success-100 text-success-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {investment.isActive ? 'Active' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(investment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Wallet Balance</h3>
              </div>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-primary-600">
                  {walletLoading ? '...' : formatCurrency(Number(wallet?.balance || 0))}
                </div>
                <p className="text-gray-500 mt-2">Available balance</p>
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 btn-primary">
                  Deposit Funds
                </button>
                <button className="flex-1 btn-secondary">
                  Withdraw Funds
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              </div>
              <div className="text-center py-8 text-gray-500">
                <WalletIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent transactions</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Available Projects</h3>
              <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-500">
                View all projects
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsLoading ? (
                <div className="col-span-full text-center py-4">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No projects available</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Goal:</span>
                        <span className="font-medium">{formatCurrency(Number(project.amountRequested))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raised:</span>
                        <span className="font-medium">{formatCurrency(Number(project.amountRaised))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ROI:</span>
                        <span className="font-medium text-success-600">{formatPercentage(Number(project.expectedROI))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{project.duration} months</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((Number(project.amountRaised) / Number(project.amountRequested)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round((Number(project.amountRaised) / Number(project.amountRequested)) * 100)}% funded</span>
                        <span>{project.duration} months left</span>
                      </div>
                    </div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="mt-4 w-full btn-primary text-center block"
                    >
                      Invest Now
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}