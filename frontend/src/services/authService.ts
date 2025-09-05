import api from './api'
import { LoginRequest, RegisterRequest, User, AuthResponse } from '../types'

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response
  },

  async register(userData: RegisterRequest) {
    const response = await api.post<AuthResponse>('/auth/register', userData)
    return response
  },

  async getProfile() {
    const response = await api.get<{ data: User }>('/auth/profile')
    return response
  },
}