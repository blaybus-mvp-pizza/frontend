import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

interface UseAuthOptions {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = '/auth/login', redirectIfFound = false } = options
  const router = useRouter()
  const { isAuthenticated, isHydrated, user, token } = useAuthStore()

  useEffect(() => {
    // Wait for hydration before making any decisions
    if (!isHydrated) return

    // Redirect logic based on authentication state
    if (!redirectIfFound && !isAuthenticated) {
      router.push(redirectTo)
    } else if (redirectIfFound && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isHydrated, redirectIfFound, redirectTo, router])

  return {
    user,
    token,
    isAuthenticated: isAuthenticated && isHydrated,
    isLoading: !isHydrated,
  }
}

// Hook for pages that require authentication
export function useRequireAuth(redirectTo: string = '/auth/login') {
  return useAuth({ redirectTo, redirectIfFound: false })
}

// Hook for pages that should redirect if user is already authenticated (like login page)
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  return useAuth({ redirectTo, redirectIfFound: true })
}