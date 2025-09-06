import axios from 'axios';
import type { AuthResponse, User, Wallet, Transaction, Project, Investment } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (email: string, password: string, name: string, role: string): Promise<AuthResponse> =>
    api.post('/auth/register', { email, password, name, role }).then(res => res.data),
  
  me: (): Promise<User> =>
    api.get('/auth/me').then(res => res.data),
};

// Wallet API
export const walletAPI = {
  getWallet: (): Promise<Wallet> =>
    api.get('/wallet').then(res => res.data),
  
  getTransactions: (): Promise<Transaction[]> =>
    api.get('/wallet/transactions').then(res => res.data),
  
  deposit: (amount: number): Promise<Transaction> =>
    api.post('/wallet/deposit', { amount }).then(res => res.data),
  
  withdraw: (amount: number): Promise<Transaction> =>
    api.post('/wallet/withdraw', { amount }).then(res => res.data),
};

// Projects API
export const projectsAPI = {
  getProjects: (): Promise<Project[]> =>
    api.get('/projects').then(res => res.data),
  
  getProject: (id: string): Promise<Project> =>
    api.get(`/projects/${id}`).then(res => res.data),
  
  createProject: (data: Partial<Project>): Promise<Project> =>
    api.post('/projects', data).then(res => res.data),
  
  updateProject: (id: string, data: Partial<Project>): Promise<Project> =>
    api.put(`/projects/${id}`, data).then(res => res.data),
  
  approveProject: (id: string): Promise<Project> =>
    api.post(`/projects/${id}/approve`).then(res => res.data),
  
  rejectProject: (id: string): Promise<Project> =>
    api.post(`/projects/${id}/reject`).then(res => res.data),
};

// Investments API
export const investmentsAPI = {
  getInvestments: (): Promise<Investment[]> =>
    api.get('/investments').then(res => res.data),
  
  invest: (projectId: string, amount: number): Promise<Investment> =>
    api.post('/investments', { projectId, amount }).then(res => res.data),
  
  getAllInvestments: (): Promise<Investment[]> =>
    api.get('/admin/investments').then(res => res.data),
};

// Users API (Admin)
export const usersAPI = {
  getUsers: (): Promise<User[]> =>
    api.get('/admin/users').then(res => res.data),
  
  verifyUser: (id: string): Promise<User> =>
    api.post(`/admin/users/${id}/verify`).then(res => res.data),
};