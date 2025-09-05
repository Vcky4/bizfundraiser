import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { projectService } from '../services/projectService'
import { useAuth } from '../contexts/AuthContext'

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [investmentAmount, setInvestmentAmount] = useState(0)

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id!),
    enabled: !!id,
  })

  const project = projectData?.data

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

  const fundingProgress = project ? (Number(project.amountRaised) / Number(project.amountRequested)) * 100 : 0
  const remainingAmount = project ? Number(project.amountRequested) - Number(project.amountRaised) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/projects" className="btn-primary">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/projects"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600">by {project.business?.businessName}</p>
              </div>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Description</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Amount Requested</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(Number(project.amountRequested))}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-success-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Expected ROI</p>
                    <p className="text-lg font-semibold text-gray-900">{formatPercentage(Number(project.expectedROI))}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 text-warning-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{project.duration} months</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Business</p>
                    <p className="text-lg font-semibold text-gray-900">{project.business?.businessName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Supporting Documents</h2>
                <div className="space-y-2">
                  {project.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">Document {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Investors */}
            {project.investments && project.investments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Investors</h2>
                <div className="space-y-3">
                  {project.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {investment.investor?.firstName} {investment.investor?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Invested {formatCurrency(Number(investment.amount))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-success-600">
                          Expected: {formatCurrency(Number(investment.expectedReturn))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-semibold">{formatCurrency(Number(project.amountRequested))}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Raised:</span>
                  <span className="font-semibold">{formatCurrency(Number(project.amountRaised))}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected ROI:</span>
                  <span className="font-semibold text-success-600">{formatPercentage(Number(project.expectedROI))}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Funding Progress</span>
                  <span>{Math.round(fundingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Investment Form */}
              {project.status === 'APPROVED' && user?.role === 'INVESTOR' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      min="100"
                      max={remainingAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: ₦100 | Maximum: {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                  
                  <button
                    disabled={!investmentAmount || investmentAmount < 100 || investmentAmount > remainingAmount}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Invest Now
                  </button>
                </div>
              )}

              {project.status === 'APPROVED' && !user && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">Sign in to invest in this project</p>
                  <Link to="/login" className="w-full btn-primary">
                    Sign In
                  </Link>
                </div>
              )}

              {project.status !== 'APPROVED' && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {project.status === 'FUNDED' && 'This project is fully funded'}
                    {project.status === 'PENDING' && 'This project is pending approval'}
                    {project.status === 'REJECTED' && 'This project was rejected'}
                    {project.status === 'REPAID' && 'This project has been repaid'}
                  </p>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium text-gray-900">{project.business?.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium text-gray-900">
                    {project.business?.firstName} {project.business?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}