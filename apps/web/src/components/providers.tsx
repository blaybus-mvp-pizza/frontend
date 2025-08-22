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
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              color: '#363636',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </NextThemesProvider>
    </AppProvider>
  )
}
