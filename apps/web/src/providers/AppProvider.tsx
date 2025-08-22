'use client'

import React from 'react'

import ErrorBoundary from '@/components/error/ErrorBoundary'
import { ModalProvider } from '@/components/modals/ModalProvider'
import { ToastContainer } from '@/components/toast/ToastContainer'

import { QueryProvider } from './QueryProvider'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ModalProvider>
          {children}
          <ToastContainer />
        </ModalProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
