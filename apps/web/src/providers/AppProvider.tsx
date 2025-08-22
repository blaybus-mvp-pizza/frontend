'use client'

import React, { useEffect } from 'react'

import ErrorBoundary from '@/components/error/ErrorBoundary'
import { ModalProvider } from '@/components/modals/ModalProvider'
import { ToastContainer } from '@/components/toast/ToastContainer'
import { useCurrentUser } from '@/api/hooks/queries/useUser'
import { useAuthStore } from '@/store/auth.store'

import { QueryProvider } from './QueryProvider'

interface AppProviderProps {
  children: React.ReactNode
}

function AuthRefreshProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser()

  useEffect(() => {
    if (user) {
      useAuthStore.getState().updateUser(user)
    }
  }, [user])

  return <>{children}</>
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthRefreshProvider>
          <ModalProvider>
            {children}
            <ToastContainer />
          </ModalProvider>
        </AuthRefreshProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
