import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

// Simple hook to get auth state
export function useAuth() {
  const { isAuthenticated, isHydrated, user, token } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated: isAuthenticated && isHydrated,
    isLoading: !isHydrated,
  }
}

// Hook for pages that require authentication
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const router = useRouter()
  const { isAuthenticated, isHydrated } = useAuthStore()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isHydrated, redirectTo, router])

  return useAuth()
}

// Hook for pages that should redirect if user is already authenticated (like login page)
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const router = useRouter()
  const { isAuthenticated, isHydrated } = useAuthStore()

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isHydrated, redirectTo, router])

  return useAuth()
}