import { useRouter } from 'next/navigation'

import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { authApi } from '@/api/endpoints/auth.api'
import { usersApi } from '@/api/endpoints/users.api'
import { LoginResponse } from '@/api/types'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'

// Google OAuth login URL
export const useGoogleLogin = () => {
  const { showError } = useUIStore()

  return useMutation({
    mutationFn: authApi.getGoogleLoginUrl,
    onSuccess: (data) => {
      // Redirect to Google OAuth
      window.location.href = data.login_url
    },
    onError: (error: AxiosError) => {
      showError('로그인 URL을 가져오는데 실패했습니다.')
      console.error('Google login error:', error)
    },
  })
}

// Handle Google OAuth callback
export const useGoogleCallback = (
  options?: UseMutationOptions<LoginResponse, AxiosError, string>,
) => {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (code: string) => authApi.handleGoogleCallback(code),

    onSuccess: async (data) => {
      // Store token first before making any API calls
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.access_token)
      }

      // Get user info
      try {
        const user = await usersApi.getMe()
        login(data.access_token, user)
        showSuccess('로그인되었습니다!')

        // Clear all queries and refetch
        queryClient.clear()

        // Redirect to home or intended page
        router.push('/')
      } catch (error) {
        showError('사용자 정보를 가져오는데 실패했습니다.')
        console.error('Failed to get user info:', error)
        // Clean up on error
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
        }
      }
    },

    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as any)?.message
      showError(errorMessage || '로그인에 실패했습니다.')
      router.push('/auth/login')
    },

    ...options,
  })
}

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const { showSuccess } = useUIStore()
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      logout()
      queryClient.clear()
      showSuccess('로그아웃되었습니다.')
      router.push('/home')
    },
  })
}
