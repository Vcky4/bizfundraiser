import api from './api'
import { Project, PaginatedResponse } from '../types'

export const projectService = {
  async getProjects(params?: {
    status?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get<PaginatedResponse<Project>>('/projects', { params })
    return response
  },

  async getProject(id: string) {
    const response = await api.get<{ data: Project }>(`/projects/${id}`)
    return response
  },

  async getUserProjects() {
    const response = await api.get<{ data: Project[] }>('/projects/my-projects')
    return response
  },

  async createProject(data: {
    title: string
    description: string
    amountRequested: number
    duration: number
    expectedROI: number
    documents?: string[]
  }) {
    const response = await api.post<{ data: Project }>('/projects', data)
    return response
  },

  async updateProject(id: string, data: Partial<{
    title: string
    description: string
    amountRequested: number
    duration: number
    expectedROI: number
    documents: string[]
  }>) {
    const response = await api.put<{ data: Project }>(`/projects/${id}`, data)
    return response
  },

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`)
    return response
  },

  async approveProject(id: string, decision: 'approve' | 'reject', reason?: string) {
    const response = await api.put(`/projects/${id}/approve`, { decision, reason })
    return response
  },

  async getPendingProjects() {
    const response = await api.get<{ data: Project[] }>('/projects/pending')
    return response
  },

  async getProjectStats() {
    const response = await api.get('/projects/stats')
    return response
  },
}