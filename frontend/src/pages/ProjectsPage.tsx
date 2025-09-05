import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { projectService } from '../services/projectService'

export const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', { search: searchTerm, status: statusFilter, page: currentPage }],
    queryFn: () => projectService.getProjects({ 
      search: searchTerm || undefined, 
      status: statusFilter || undefined,
      page: currentPage,
      limit: 12
    }),
  })

  const projects = projectsData?.data?.data || []
  const pagination = projectsData?.data?.pagination

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning-100 text-warning-800'
      case 'APPROVED':
        return 'bg-success-100 text-success-800'
      case 'FUNDED':
        return 'bg-primary-100 text-primary-800'
      case 'REJECTED':
        return 'bg-danger-100 text-danger-800'
      case 'REPAID':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Investment Projects</h1>
              <p className="text-gray-600">Discover and invest in promising business opportunities</p>
            </div>
            <Link
              to="/login"
              className="btn-primary"
            >
              Sign In to Invest
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search projects..."
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="FUNDED">Funded</option>
                <option value="REPAID">Repaid</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new projects.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {project.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Business:</span>
                        <span className="font-medium">{project.business?.businessName}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Goal:</span>
                        <span className="font-medium">{formatCurrency(Number(project.amountRequested))}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raised:</span>
                        <span className="font-medium">{formatCurrency(Number(project.amountRaised))}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected ROI:</span>
                        <span className="font-medium text-success-600">{formatPercentage(Number(project.expectedROI))}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{project.duration} months</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Funding Progress</span>
                          <span>{Math.round((Number(project.amountRaised) / Number(project.amountRequested)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min((Number(project.amountRaised) / Number(project.amountRequested)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="flex-1 btn-primary text-center flex items-center justify-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                      {project.status === 'APPROVED' && (
                        <button className="flex-1 btn-success text-center flex items-center justify-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          Invest Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}