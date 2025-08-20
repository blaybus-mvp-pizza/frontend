'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentUser } from '@/api/hooks/queries/useUser';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth/login' }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      router.push(redirectTo);
      return;
    }

    // If token exists but user fetch fails (401), redirect to login
    if (error && !isLoading) {
      router.push(redirectTo);
    }
  }, [token, error, isLoading, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}