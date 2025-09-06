import axios from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Wallet,
  Project,
  Investment,
  Transaction,
  DepositRequest,
  WithdrawRequest,
  CreateProjectRequest,
  CreateInvestmentRequest,
  UpdateProfileRequest,
  UpdateBusinessProfileRequest,
  ApproveProjectRequest,
  ProcessRepaymentRequest,
  UpdateCommissionRequest
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
  
  getProfile: (): Promise<User> =>
    api.get('/auth/profile').then(res => res.data),
};

// Users API
export const usersApi = {
  getProfile: (): Promise<User> =>
    api.get('/users/profile').then(res => res.data),
  
  updateProfile: (data: UpdateProfileRequest): Promise<User> =>
    api.put('/users/profile', data).then(res => res.data),
  
  updateBusinessProfile: (data: UpdateBusinessProfileRequest): Promise<User> =>
    api.put('/users/business-profile', data).then(res => res.data),
  
  completeKYC: (): Promise<User> =>
    api.post('/users/complete-kyc').then(res => res.data),
  
  getAllUsers: (): Promise<User[]> =>
    api.get('/users/all').then(res => res.data),
};

// Wallets API
export const walletsApi = {
  getWallet: (): Promise<Wallet> =>
    api.get('/wallets').then(res => res.data),
  
  getBalance: (): Promise<{ balance: number }> =>
    api.get('/wallets/balance').then(res => res.data),
  
  deposit: (data: DepositRequest): Promise<Transaction> =>
    api.post('/wallets/deposit', data).then(res => res.data),
  
  withdraw: (data: WithdrawRequest): Promise<Transaction> =>
    api.post('/wallets/withdraw', data).then(res => res.data),
  
  getTransactions: (params?: {
    type?: string;
    status?: string;
    page?: string;
    limit?: string;
  }): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> =>
    api.get('/wallets/transactions', { params }).then(res => res.data),
  
  getTransaction: (id: string): Promise<Transaction> =>
    api.get(`/wallets/transactions/${id}`).then(res => res.data),
};

// Projects API
export const projectsApi = {
  createProject: (data: CreateProjectRequest): Promise<Project> =>
    api.post('/projects', data).then(res => res.data),
  
  getProjects: (params?: {
    status?: string;
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<{ projects: Project[]; total: number; page: number; limit: number }> =>
    api.get('/projects', { params }).then(res => res.data),
  
  getMyProjects: (): Promise<Project[]> =>
    api.get('/projects/my-projects').then(res => res.data),
  
  getPendingProjects: (): Promise<Project[]> =>
    api.get('/projects/pending').then(res => res.data),
  
  getProjectStats: (): Promise<any> =>
    api.get('/projects/stats').then(res => res.data),
  
  getProject: (id: string): Promise<Project> =>
    api.get(`/projects/${id}`).then(res => res.data),
  
  updateProject: (id: string, data: Partial<CreateProjectRequest>): Promise<Project> =>
    api.put(`/projects/${id}`, data).then(res => res.data),
  
  deleteProject: (id: string): Promise<void> =>
    api.delete(`/projects/${id}`).then(res => res.data),
  
  approveProject: (id: string, data: ApproveProjectRequest): Promise<Project> =>
    api.put(`/projects/${id}/approve`, data).then(res => res.data),
};

// Investments API
export const investmentsApi = {
  createInvestment: (data: CreateInvestmentRequest): Promise<Investment> =>
    api.post('/investments', data).then(res => res.data),
  
  getInvestments: (params?: {
    status?: string;
    page?: string;
    limit?: string;
  }): Promise<{ investments: Investment[]; total: number; page: number; limit: number }> =>
    api.get('/investments', { params }).then(res => res.data),
  
  getInvestmentStats: (): Promise<any> =>
    api.get('/investments/stats').then(res => res.data),
  
  getAllInvestments: (params?: {
    status?: string;
    page?: string;
    limit?: string;
  }): Promise<{ investments: Investment[]; total: number; page: number; limit: number }> =>
    api.get('/investments/all', { params }).then(res => res.data),
  
  getInvestment: (id: string): Promise<Investment> =>
    api.get(`/investments/${id}`).then(res => res.data),
};

// Admin API
export const adminApi = {
  getDashboardStats: (): Promise<any> =>
    api.get('/admin/dashboard').then(res => res.data),
  
  getRecentActivity: (): Promise<any> =>
    api.get('/admin/activity').then(res => res.data),
  
  getPlatformMetrics: (): Promise<any> =>
    api.get('/admin/metrics').then(res => res.data),
  
  processRepayment: (data: ProcessRepaymentRequest): Promise<any> =>
    api.post('/admin/repayment', data).then(res => res.data),
  
  getCommissionSettings: (): Promise<any> =>
    api.get('/admin/commission-settings').then(res => res.data),
  
  updateCommissionSettings: (data: UpdateCommissionRequest): Promise<any> =>
    api.put('/admin/commission-settings', data).then(res => res.data),
  
  getProjectInvestors: (projectId: string): Promise<User[]> =>
    api.get(`/admin/project/${projectId}/investors`).then(res => res.data),
};

export default api;