'use client'

import React from 'react'

import { queryClient } from '@/providers/QueryProvider'
import { useUIStore } from '@/store/ui.store'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // e.g., Sentry.captureException(error);
    }

    // Show error modal
    if (typeof window !== 'undefined') {
      useUIStore.getState().openModal({
        type: 'error',
        props: {
          title: '오류가 발생했습니다',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? errorInfo : undefined,
        },
      })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Clear React Query cache
    if (typeof window !== 'undefined' && queryClient) {
      queryClient.clear()
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props

      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} reset={this.handleReset} />
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold">문제가 발생했습니다</h1>
            <p className="mb-6 text-gray-600">페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 rounded-lg bg-gray-100 p-4 text-left">
                <p className="font-mono text-sm text-gray-700">{this.state.error.message}</p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
