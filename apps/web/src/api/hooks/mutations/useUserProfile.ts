import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersApi } from '@/api/endpoints/users.api'
import { myPageKeys } from '@/api/hooks/queries/useMyPage'
import { queryKeys } from '@/api/queryKeys'
import { PhoneVerificationResult, SendSMSResult, UserRead, UserUpdate } from '@/api/types'
import { useUIStore } from '@/store/ui.store'

// Update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation<UserRead, Error, UserUpdate>({
    mutationFn: (data: UserUpdate) => usersApi.updateMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(myPageKeys.profile(), data)
      queryClient.invalidateQueries({ queryKey: myPageKeys.profile() })
      showSuccess('프로필이 업데이트되었습니다.')
    },
    onError: () => {
      showError('프로필 업데이트에 실패했습니다.')
    },
  })
}

// Send phone verification SMS
export const useSendPhoneVerificationSMS = () => {
  const { showSuccess, showError } = useUIStore()

  return useMutation<SendSMSResult, Error, string>({
    mutationFn: (phoneNumber: string) => usersApi.sendPhoneVerificationSMS(phoneNumber),
    onSuccess: (data) => {
      if (data.success) {
        showSuccess('인증번호가 전송되었습니다.')
      } else {
        showError('인증번호 전송에 실패했습니다.')
      }
    },
    onError: () => {
      showError('인증번호 전송에 실패했습니다.')
    },
  })
}

// Verify phone number
export const useVerifyPhone = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()
  const router = useRouter()
  
  return useMutation<PhoneVerificationResult, Error, { phone_number: string; code6: string }>({
    mutationFn: ({ phone_number, code6 }) => usersApi.verifyPhone(phone_number, code6),

    onSuccess: async (data, variables) => {
      if (data.success) {
        // After successful verification, update the user profile with phone_number and is_phone_verified
        try {
          // Get current user data to preserve other fields
          const currentUser = queryClient.getQueryData<UserRead>(myPageKeys.profile())
          
          // Update user profile with phone number and verification status
          await usersApi.updateMe({
            nickname: currentUser?.nickname || '',
            phone_number: variables.phone_number,
            is_phone_verified: true,
            profile_image_url: currentUser?.profile_image_url
          })
          
          // Invalidate both myPage profile and current user queries
          queryClient.invalidateQueries({ queryKey: myPageKeys.profile() })
          queryClient.invalidateQueries({ queryKey: queryKeys.users.me() })
          
          showSuccess('휴대폰 인증이 완료되었습니다.')
          router.push('/home')
        } catch (error) {
          console.error('Failed to update profile after verification:', error)
          showError('인증은 성공했지만 프로필 업데이트에 실패했습니다.')
        }
      } else {
        showError('인증에 실패했습니다.')
      }
    },
    onError: () => {
      showError('인증번호가 올바르지 않습니다.')
    },
  })
}
