import { apiClient } from '../client/apiClient'
import {
  PhoneVerificationResult,
  SendSMSResult,
  UserRead,
  UserUpdate,
} from '../types'

export const usersApi = {
  // Get current user
  getMe: async (): Promise<UserRead> => {
    const response = await apiClient.get('/users/me')
    return response.data
  },

  // Update current user
  updateMe: async (data: UserUpdate): Promise<UserRead> => {
    const response = await apiClient.put('/users/me', data)
    return response.data
  },

  // Send phone verification SMS - phone_number as query parameter
  sendPhoneVerificationSMS: async (phoneNumber: string): Promise<SendSMSResult> => {
    const response = await apiClient.post('/users/me/phone-verification-sms', null, {
      params: { phone_number: phoneNumber }
    })
    return response.data
  },

  // Verify phone with code - both phone_number and code6 as query parameters
  verifyPhone: async (phoneNumber: string, code6: string): Promise<PhoneVerificationResult> => {
    const response = await apiClient.post('/users/me/phone-verification-sms/verify', null, {
      params: { 
        phone_number: phoneNumber,
        code6: code6
      }
    })
    return response.data
  },

  // Get user profile by ID
  getUserProfile: async (userId: number): Promise<UserRead> => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/users/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
