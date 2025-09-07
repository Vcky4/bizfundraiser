export interface User {
  id: string;
  email: string;
  name: string;
  role: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  phone?: string;
  isVerified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface InvestorProfile extends User {
  role: 'INVESTOR';
  idDocument?: string;
}

export interface BusinessProfile extends User {
  role: 'BUSINESS';
  cacNumber?: string;
  taxId?: string;
  documents?: string[];
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'PAYOUT';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  businessId: string;
  businessName: string;
  fundingGoal: number;
  currentFunding: number;
  duration: number;
  projectedROI: number;
  status: 'PENDING' | 'APPROVED' | 'FUNDED' | 'REPAID' | 'REJECTED';
  startDate?: string;
  endDate?: string;
  documents?: string[];
  createdAt: string;
}

export interface ProjectResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface InvestmentResponse {
  investments: Investment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Investment {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  expectedReturn: number;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  investmentDate: string;
  expectedPayoutDate: string;
  project: Project;
}

export interface AuthResponse {
  token: string;
  user: User;
}