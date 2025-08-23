import { useState, useCallback } from 'react'
import { authService } from '@/services/api/auth'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated, setAuthenticated } = useAuthStore()

  // 인증 상태 체크
  const checkAuth = useCallback(async (): Promise<boolean> => {
    // 이미 인증되어 있다면 true 반환
    if (isAuthenticated) {
      return true
    }

    setIsCheckingAuth(true)
    try {
      const user = await authService.getMe()
      const isLoggedIn = !!user
      setAuthenticated(isLoggedIn)
      return isLoggedIn
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthenticated(false)
      return false
    } finally {
      setIsCheckingAuth(false)
    }
  }, [isAuthenticated, setAuthenticated])

  // 인증이 필요한 액션 실행
  const executeWithAuth = useCallback(async (
    action: () => void | Promise<void>,
    customMessage?: string
  ) => {
    const isLoggedIn = await checkAuth()
    
    if (isLoggedIn) {
      await action()
    } else {
      setShowLoginModal(true)
    }
  }, [checkAuth])

  return {
    isAuthenticated,
    isCheckingAuth,
    showLoginModal,
    setShowLoginModal,
    checkAuth,
    executeWithAuth
  }
}