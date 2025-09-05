export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'INVESTOR' | 'BUSINESS' | 'ADMIN'
  phone?: string
  kycCompleted: boolean
  businessName?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'INVESTOR' | 'BUSINESS'
  phone?: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'REPAYMENT' | 'COMMISSION' | 'REFUND'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  amount: number
  description?: string
  reference?: string
  metadata?: any
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Project {
  id: string
  title: string
  description: string
  businessId: string
  amountRequested: number
  amountRaised: number
  duration: number
  expectedROI: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FUNDED' | 'REPAID' | 'CANCELLED'
  isActive: boolean
  createdAt: string
  updatedAt: string
  approvedAt?: string
  fundedAt?: string
  repaidAt?: string
  documents: string[]
  business: {
    id: string
    firstName: string
    lastName: string
    businessName: string
  }
  investments?: Investment[]
}

export interface Investment {
  id: string
  investorId: string
  projectId: string
  amount: number
  expectedReturn: number
  actualReturn?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  repaidAt?: string
  investor?: {
    id: string
    firstName: string
    lastName: string
  }
  project?: Project
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}