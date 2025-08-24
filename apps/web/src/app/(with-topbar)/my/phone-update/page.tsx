'use client'

import { Suspense, useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Typography } from '@workspace/ui/components/typography'
import { ArrowLeft } from 'lucide-react'

import PhoneNumberVerification from '@/components/my/phone-number-verification'
import { useCurrentUser } from '@/api/hooks/queries/useUser'

function PhoneUpdateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: user, isLoading } = useCurrentUser()
  const [redirectUrl, setRedirectUrl] = useState<string>('/home')

  useEffect(() => {
    // Get the redirect URL from query params
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect))
    }
  }, [searchParams])

  useEffect(() => {
    // If user is already verified and there's no explicit request to update,
    // redirect them
    if (user?.is_phone_verified && !searchParams.get('force')) {
      router.push(redirectUrl)
    }
  }, [user, redirectUrl, router, searchParams])

  const handleBack = () => {
    router.back()
  }

  const handleVerificationComplete = () => {
    // Redirect to the intended page after successful verification
    router.push(redirectUrl)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Typography variant="body1" className="text-gray-500">
            로딩중...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <button
          onClick={handleBack}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <Typography variant="h2" weight="bold">
          전화번호 인증
        </Typography>
      </div>

      {/* Info Message */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <Typography variant="body2" className="text-blue-800">
          안전한 거래를 위해 전화번호 인증이 필요합니다.
        </Typography>
      </div>

      {/* Phone Verification Component */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <PhoneNumberVerification 
          userPhoneNumber={user?.phone_number}
          isPhoneVerified={user?.is_phone_verified}
          onVerificationComplete={handleVerificationComplete}
          isStandalonePage={true}
        />
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <Typography variant="caption" className="text-gray-500">
          인증번호가 오지 않나요?
        </Typography>
        <Typography variant="caption" className="mt-1 block text-gray-500">
          스팸 문자함을 확인하거나 번호를 다시 확인해주세요.
        </Typography>
      </div>
    </div>
  )
}

export default function PhoneUpdatePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Typography variant="body1" className="text-gray-500">
            로딩중...
          </Typography>
        </div>
      </div>
    }>
      <PhoneUpdateContent />
    </Suspense>
  )
}