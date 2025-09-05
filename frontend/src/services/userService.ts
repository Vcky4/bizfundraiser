import api from './api'
import { User } from '../types'

export const userService = {
  async getProfile() {
    const response = await api.get<{ data: User }>('/users/profile')
    return response
  },

  async updateProfile(data: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    idNumber?: string
    idDocument?: string
  }) {
    const response = await api.put<{ data: User }>('/users/profile', data)
    return response
  },

  async updateBusinessProfile(data: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    dateOfBirth?: string
    idNumber?: string
    idDocument?: string
    businessName?: string
    cacNumber?: string
    taxId?: string
    businessAddress?: string
    businessDocuments?: string[]
  }) {
    const response = await api.put<{ data: User }>('/users/business-profile', data)
    return response
  },

  async completeKYC() {
    const response = await api.post<{ data: User }>('/users/complete-kyc')
    return response
  },

  async getAllUsers() {
    const response = await api.get<{ data: User[] }>('/users/all')
    return response
  },
}