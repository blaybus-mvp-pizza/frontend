import { apiClient } from '@/api/client/apiClient'

export interface UserInfo {
  id: number
  email: string
  nickname?: string
  phone?: string
  is_active: boolean
  created_at: string
}

export const authService = {
  // 현재 로그인한 사용자 정보 조회
  async getMe(): Promise<UserInfo | null> {
    try {
      const response = await apiClient.get<UserInfo>('/auth/me')
      return response.data
    } catch (error: any) {
      // 401 에러는 로그인되지 않은 상태
      if (error.response?.status === 401) {
        return null
      }
      throw error
    }
  },

  // 로그인 여부 체크
  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getMe()
      return !!user
    } catch {
      return false
    }
  }
}