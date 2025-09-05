import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { userService } from '../services/userService'
import { useAuth } from '../contexts/AuthContext'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })

  const profile = profileData?.data

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      dateOfBirth: profile?.dateOfBirth || '',
      idNumber: profile?.idNumber || '',
      idDocument: profile?.idDocument || '',
      businessName: profile?.businessName || '',
      cacNumber: profile?.cacNumber || '',
      taxId: profile?.taxId || '',
      businessAddress: profile?.businessAddress || '',
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'kyc', name: 'KYC Verification', icon: DocumentTextIcon },
    { id: 'business', name: 'Business Info', icon: BuildingOfficeIcon },
  ]

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (user?.role === 'BUSINESS') {
        await userService.updateBusinessProfile(data)
      } else {
        await userService.updateProfile(data)
      }
      await refetch()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteKYC = async () => {
    try {
      setIsSubmitting(true)
      await userService.completeKYC()
      await refetch()
    } catch (error) {
      console.error('Error completing KYC:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getKYCStatus = () => {
    if (!profile) return { status: 'unknown', message: 'Loading...' }
    
    if (profile.kycCompleted) {
      return { status: 'completed', message: 'KYC Completed' }
    }

    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'idNumber', 'idDocument']
    const businessRequiredFields = user?.role === 'BUSINESS' 
      ? ['businessName', 'cacNumber', 'taxId', 'businessAddress']
      : []

    const allRequiredFields = [...requiredFields, ...businessRequiredFields]
    const missingFields = allRequiredFields.filter(field => !profile[field])

    if (missingFields.length === 0) {
      return { status: 'ready', message: 'Ready to complete KYC' }
    }

    return { 
      status: 'incomplete', 
      message: `Missing: ${missingFields.join(', ')}` 
    }
  }

  const kycStatus = getKYCStatus()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and verification</p>
        </div>
        <div className="flex items-center space-x-4">
          {kycStatus.status === 'completed' && (
            <div className="flex items-center text-success-600">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
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
        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      className="mt-1 input-field"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      className="mt-1 input-field"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="mt-1 input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      className="mt-1 input-field"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      {...register('address')}
                      rows={3}
                      className="mt-1 input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.firstName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.lastName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">KYC Verification</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {kycStatus.status === 'completed' ? (
                    <CheckCircleIcon className="h-8 w-8 text-success-600 mr-3" />
                  ) : (
                    <XCircleIcon className="h-8 w-8 text-warning-600 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Verification Status</p>
                    <p className="text-sm text-gray-600">{kycStatus.message}</p>
                  </div>
                </div>
                {kycStatus.status === 'ready' && (
                  <button
                    onClick={handleCompleteKYC}
                    disabled={isSubmitting}
                    className="btn-success disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Complete KYC'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Required Information</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center">
                    <CheckCircleIcon className={`h-5 w-5 mr-2 ${profile?.idNumber ? 'text-success-600' : 'text-gray-300'}`} />
                    <span className="text-sm text-gray-700">ID Number</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className={`h-5 w-5 mr-2 ${profile?.idDocument ? 'text-success-600' : 'text-gray-300'}`} />
                    <span className="text-sm text-gray-700">ID Document</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className={`h-5 w-5 mr-2 ${profile?.address ? 'text-success-600' : 'text-gray-300'}`} />
                    <span className="text-sm text-gray-700">Address</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className={`h-5 w-5 mr-2 ${profile?.phone ? 'text-success-600' : 'text-gray-300'}`} />
                    <span className="text-sm text-gray-700">Phone Number</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> KYC verification is required to create projects or make investments. 
                  Please ensure all required information is complete and accurate.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'business' && user?.role === 'BUSINESS' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                      {...register('businessName')}
                      className="mt-1 input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">CAC Number</label>
                    <input
                      {...register('cacNumber')}
                      className="mt-1 input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                    <input
                      {...register('taxId')}
                      className="mt-1 input-field"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Business Address</label>
                    <textarea
                      {...register('businessAddress')}
                      rows={3}
                      className="mt-1 input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.businessName || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">CAC Number</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.cacNumber || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.taxId || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Address</label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.businessAddress || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}