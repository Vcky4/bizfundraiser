import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  PlusIcon, 
  ChartBarIcon, 
  BuildingOfficeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { projectService } from '../services/projectService'
import { Link } from 'react-router-dom'

export const BusinessDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch user projects
  const { data: projectsData, isLoading: projectsLoading, refetch } = useQuery({
    queryKey: ['user-projects'],
    queryFn: () => projectService.getUserProjects(),
  })

  // Fetch project stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['project-stats'],
    queryFn: () => projectService.getProjectStats(),
  })

  const projects = projectsData?.data || []
  const stats = statsData?.data

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'projects', name: 'My Projects', icon: BuildingOfficeIcon },
    { id: 'create', name: 'Create Project', icon: PlusIcon },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="text-gray-600">Manage your projects and track funding progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.totalProjects || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Funded Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.fundedProjects || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.pendingProjects || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Raised</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : formatCurrency(Number(stats?.totalAmountRaised || 0))}
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
            {/* Recent Projects */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              </div>
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No projects yet</p>
                    <p className="text-sm">Create your first project to get started</p>
                  </div>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm text-gray-600">
                            Goal: {formatCurrency(Number(project.amountRequested))}
                          </span>
                          <span className="text-sm text-gray-600">
                            Raised: {formatCurrency(Number(project.amountRaised))}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setActiveTab('create')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <PlusIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Create New Project</p>
                  <p className="text-sm text-gray-500">Submit a project for funding</p>
                </button>
                <Link
                  to="/projects"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <EyeIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Browse All Projects</p>
                  <p className="text-sm text-gray-500">See what others are doing</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">My Projects</h3>
            </div>
            <div className="space-y-4">
              {projectsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No projects yet</p>
                  <p className="text-sm">Create your first project to get started</p>
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
                          Goal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Raised
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {project.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(Number(project.amountRequested))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(Number(project.amountRaised))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-primary-600 hover:text-primary-500"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Link>
                              {project.status === 'PENDING' && (
                                <>
                                  <button className="text-gray-600 hover:text-gray-500">
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button className="text-danger-600 hover:text-danger-500">
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
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

        {activeTab === 'create' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
            </div>
            <div className="text-center py-12">
              <PlusIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Project Creation Form</h4>
              <p className="text-gray-500 mb-6">
                Fill out the form below to submit your project for funding consideration
              </p>
              <button className="btn-primary">
                Start Creating Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}