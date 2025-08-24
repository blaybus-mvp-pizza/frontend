'use client'

import * as React from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'sonner'

import { AppProvider } from '@/providers/AppProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
        <Toaster 
          position="bottom-left"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              padding: '16px 24px',
              minHeight: '60px',
              minWidth: '320px',
            },
          }}
        />
      </NextThemesProvider>
    </AppProvider>
  )
}
