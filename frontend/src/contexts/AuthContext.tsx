import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Verify token is still valid
          const profile = await authService.getProfile()
          setUser(profile.data)
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)
      const { user, token } = response.data

      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await authService.register(userData)
      const { user, token } = response.data

      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}