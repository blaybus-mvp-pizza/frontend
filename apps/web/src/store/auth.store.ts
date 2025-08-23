import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

import { UserRead } from '@/api/types'

interface AuthState {
  user: UserRead | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean

  // Actions
  login: (token: string, user: UserRead) => void
  logout: () => void
  updateUser: (user: Partial<UserRead>) => void
  setLoading: (loading: boolean) => void
  setToken: (token: string) => void
  setHydrated: () => void
  setAuthenticated: (authenticated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isHydrated: false,

        login: (token, user) => {
          // Store token in localStorage for axios interceptor
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token)
          }

          set(
            {
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            'auth/login',
          )
        },

        logout: () => {
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('auth-storage')
          }

          set(
            {
              token: null,
              user: null,
              isAuthenticated: false,
            },
            false,
            'auth/logout',
          )
        },

        updateUser: (userData) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }),
            false,
            'auth/updateUser',
          ),

        setLoading: (loading) => set({ isLoading: loading }, false, 'auth/setLoading'),

        setToken: (token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token)
          }
          set({ token, isAuthenticated: true }, false, 'auth/setToken')
        },

        setHydrated: () => set({ isHydrated: true }, false, 'auth/setHydrated'),
        
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }, false, 'auth/setAuthenticated'),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated()
        },
      },
    ),
    {
      name: 'auth-store',
    },
  ),
)
