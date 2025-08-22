'use client'

import { Suspense, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { usersApi } from '@/api/endpoints/users.api'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'

function GoogleCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuthStore()
  const { showError, showSuccess } = useUIStore()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('access_token')
      const error = searchParams.get('error')

      if (error) {
        showError(error === 'login_failed' ? '로그인에 실패했습니다.' : error)
        router.push('/auth/login')
        return
      }

      if (token) {
        // Store token in localStorage first
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token)
        }

        try {
          // Get user info
          const user = await usersApi.getMe()
          login(token, user)
          showSuccess('로그인되었습니다!')
          router.push('/')
        } catch (error) {
          showError('사용자 정보를 가져오는데 실패했습니다.')
          console.error('Failed to get user info:', error)
          // Clean up on error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
          }
          router.push('/auth/login')
        }
      } else {
        showError('인증 토큰이 없습니다.')
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [searchParams, router, login, showError, showSuccess])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <p className="text-lg">로그인 처리 중...</p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-lg">로딩 중...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
