import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { usersApi } from '@/api/endpoints/users.api'
import { queryKeys } from '@/api/queryKeys'
import { UserRead } from '@/api/types'
import { useAuthStore } from '@/store/auth.store'

// Get current user
export const useCurrentUser = (options?: UseQueryOptions<UserRead>) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => {
      const user = await usersApi.getMe()
      // Update auth store with latest user data
      useAuthStore.getState().updateUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  })
}

// Get user profile by ID
export const useUserProfile = (userId: number, options?: UseQueryOptions<UserRead>) => {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => usersApi.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
