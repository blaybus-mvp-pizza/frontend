import { useAuthStore } from "@/stores";

export function useAuth() {
  const { isAuthenticated, login, logout } = useAuthStore();
  return { isAuthenticated, login, logout };
}
