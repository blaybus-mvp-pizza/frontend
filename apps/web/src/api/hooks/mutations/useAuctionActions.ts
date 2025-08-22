import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { auctionActionsApi } from '@/api/endpoints/auction-actions.api'
import { BidResult, BuyNowResult } from '@/api/types'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useUserProfile } from '@/api/hooks/queries/useMyPage'
import { useState } from 'react'

// Place bid
export const usePlaceBid = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()
  const { isLoggedIn } = useAuthStore()
  const { data: user } = useUserProfile()
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false)

  const mutation = useMutation<BidResult, Error, { auctionId: number; amount: number }>({
    mutationFn: ({ auctionId, amount }) => {
      // Check if logged in
      if (!isLoggedIn) {
        throw new Error('LOGIN_REQUIRED')
      }
      
      // Check if phone is verified
      if (!user?.is_phone_verified) {
        throw new Error('PHONE_VERIFICATION_REQUIRED')
      }
      
      return auctionActionsApi.placeBid(auctionId, amount)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showSuccess(`입찰이 성공적으로 완료되었습니다. (입찰가: ${data.amount.toLocaleString()}원)`)
    },
    onError: (error: Error) => {
      if (error.message === 'LOGIN_REQUIRED') {
        showError('로그인이 필요합니다.')
        // Redirect to login
        window.location.href = '/auth/login'
      } else if (error.message === 'PHONE_VERIFICATION_REQUIRED') {
        setShowPhoneVerificationModal(true)
      } else {
        showError('입찰에 실패했습니다.')
      }
    },
  })

  return {
    ...mutation,
    showPhoneVerificationModal,
    setShowPhoneVerificationModal,
  }
}

// Buy now
export const useBuyNow = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { showSuccess, showError } = useUIStore()
  const { isLoggedIn } = useAuthStore()
  const { data: user } = useUserProfile()
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false)

  const mutation = useMutation<BuyNowResult, Error, number>({
    mutationFn: (auctionId: number) => {
      // Check if logged in
      if (!isLoggedIn) {
        throw new Error('LOGIN_REQUIRED')
      }
      
      // Check if phone is verified
      if (!user?.is_phone_verified) {
        throw new Error('PHONE_VERIFICATION_REQUIRED')
      }
      
      return auctionActionsApi.buyNow(auctionId)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      
      if (data.status === 'success' || data.status === 'completed') {
        showSuccess('즉시구매가 완료되었습니다!')
        // Redirect to my page or order complete page
        router.push('/my')
      } else {
        showSuccess('주문이 처리되었습니다.')
      }
    },
    onError: (error: Error) => {
      if (error.message === 'LOGIN_REQUIRED') {
        showError('로그인이 필요합니다.')
        // Redirect to login
        window.location.href = '/auth/login'
      } else if (error.message === 'PHONE_VERIFICATION_REQUIRED') {
        setShowPhoneVerificationModal(true)
      } else {
        showError('즉시구매에 실패했습니다.')
      }
    },
  })

  return {
    ...mutation,
    showPhoneVerificationModal,
    setShowPhoneVerificationModal,
  }
}