'use client'

import { useRequireAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  loadingComponent?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  redirectTo = '/auth/login',
  loadingComponent
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useRequireAuth(redirectTo)

  // Show loading state while checking auth
  if (isLoading) {
    return loadingComponent || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-lg">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children (useRequireAuth will handle redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
