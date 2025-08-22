import { apiClient } from '../client/apiClient'
import { GoogleLoginUrlResponse, LoginResponse } from '../types'

export const authApi = {
  getGoogleLoginUrl: async (): Promise<GoogleLoginUrlResponse> => {
    const response = await apiClient.get('/auth/login/google/login-url')
    return response.data
  },

  handleGoogleCallback: async (code: string): Promise<LoginResponse> => {
    const response = await apiClient.get('/auth/login/google/callback', {
      params: { code },
    })
    return response.data
  },

  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.status === 200
    } catch {
      return false
    }
  },

  // Logout (client-side only for now)
  logout: async (): Promise<void> => {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
    }
  },
}
