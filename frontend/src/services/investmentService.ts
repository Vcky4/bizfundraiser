import api from './api'
import { Investment, PaginatedResponse } from '../types'

export const investmentService = {
  async getInvestments(params?: {
    projectId?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get<PaginatedResponse<Investment>>('/investments', { params })
    return response
  },

  async getInvestment(id: string) {
    const response = await api.get<{ data: Investment }>(`/investments/${id}`)
    return response
  },

  async createInvestment(data: {
    projectId: string
    amount: number
  }) {
    const response = await api.post<{ data: Investment }>('/investments', data)
    return response
  },

  async getInvestmentStats() {
    const response = await api.get('/investments/stats')
    return response
  },

  async getAllInvestments(params?: {
    projectId?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get<PaginatedResponse<Investment>>('/investments/all', { params })
    return response
  },
}