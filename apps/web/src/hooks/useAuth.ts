import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const { isAuthenticated, login, logout } = useAuthStore()
  return { isAuthenticated, login, logout }
}
