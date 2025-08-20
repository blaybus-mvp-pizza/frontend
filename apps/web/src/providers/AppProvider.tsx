'use client';

import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { ToastContainer } from '@/components/toast/ToastContainer';
import ErrorBoundary from '@/components/error/ErrorBoundary';

interface AppProviderProps {
  children: React.ReactNode;
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
  );
}