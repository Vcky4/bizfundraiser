import api from './api'
import { Wallet, Transaction, PaginatedResponse } from '../types'

export const walletService = {
  async getWallet() {
    const response = await api.get<{ data: Wallet }>('/wallets')
    return response
  },

  async getBalance() {
    const response = await api.get<{ data: { balance: number } }>('/wallets/balance')
    return response
  },

  async deposit(data: {
    amount: number
    description?: string
  }) {
    const response = await api.post('/wallets/deposit', data)
    return response
  },

  async withdraw(data: {
    amount: number
    description?: string
  }) {
    const response = await api.post('/wallets/withdraw', data)
    return response
  },

  async getTransactions(params?: {
    type?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get<PaginatedResponse<Transaction>>('/wallets/transactions', { params })
    return response
  },

  async getTransaction(id: string) {
    const response = await api.get<{ data: Transaction }>(`/wallets/transactions/${id}`)
    return response
  },
}