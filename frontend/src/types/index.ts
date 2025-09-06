export const UserRole = {
  INVESTOR: 'INVESTOR',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ProjectStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FUNDED: 'FUNDED',
  REPAID: 'REPAID',
  CANCELLED: 'CANCELLED'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  INVESTMENT: 'INVESTMENT',
  REPAYMENT: 'REPAYMENT',
  COMMISSION: 'COMMISSION',
  REFUND: 'REFUND'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  kycCompleted: boolean;
  idNumber?: string;
  idDocument?: string;
  address?: string;
  dateOfBirth?: string;
  businessName?: string;
  cacNumber?: string;
  taxId?: string;
  businessAddress?: string;
  businessDocuments?: string[];
  wallet?: Wallet;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  businessId: string;
  amountRequested: number;
  amountRaised: number;
  duration: number;
  expectedROI: number;
  status: ProjectStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  fundedAt?: string;
  repaidAt?: string;
  documents?: string[];
  business?: User;
  investments?: Investment[];
}

export interface Investment {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  expectedReturn: number;
  actualReturn?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  repaidAt?: string;
  investor?: User;
  project?: Project;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description?: string;
  reference?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Commission {
  id: string;
  projectId: string;
  amount: number;
  percentage: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface DepositRequest {
  amount: number;
  description?: string;
}

export interface WithdrawRequest {
  amount: number;
  description?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  amountRequested: number;
  duration: number;
  expectedROI: number;
  documents?: string[];
}

export interface CreateInvestmentRequest {
  projectId: string;
  amount: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  idNumber?: string;
  idDocument?: string;
}

export interface UpdateBusinessProfileRequest extends UpdateProfileRequest {
  businessName?: string;
  cacNumber?: string;
  taxId?: string;
  businessAddress?: string;
  businessDocuments?: string[];
}

export interface ApproveProjectRequest {
  decision: 'approve' | 'reject';
  reason?: string;
}

export interface ProcessRepaymentRequest {
  projectId: string;
  amount: number;
}

export interface UpdateCommissionRequest {
  fundingCommission: number;
  profitCommission: number;
}