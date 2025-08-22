'use client'

import Image from 'next/image'

import { Button } from '@workspace/ui/components/button'

import { useGoogleLogin } from '@/api/hooks/mutations/useAuth'
import { useUIStore } from '@/store/ui.store'

export default function SignupForm() {
  const googleLogin = useGoogleLogin()
  const { setLoading, isLoading } = useUIStore()

  const handleGoogleSignup = async () => {
    setLoading('google-signup', true)
    try {
      // Same OAuth flow for signup as login
      await googleLogin.mutateAsync()
    } catch (error) {
      console.error('Google signup failed:', error)
    } finally {
      setLoading('google-signup', false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8 px-4">
      <div className="flex w-full flex-col items-center gap-2">
        <p className="w-full text-center text-[#7676760px] text-lg font-normal leading-[1.4] tracking-[-0.025em]">
          나팔과 함께 시작하는 의미 있는 소비
        </p>
        <div className="flex w-full flex-col items-center gap-0.5">
          <h1 className="text-text-primary text-center text-xl font-bold leading-[1.4] tracking-[-0.025em] md:text-[22px]">
            회원가입하고
          </h1>
          <h1 className="text-text-primary trtext-text-primaryem] text-xl font-bold leading-[1.4] md:text-[22px]">
            특별한 쇼핑 경험을 시작하세요.
          </h1>
        </div>
      </div>
      <Button
        onClick={handleGoogleSignup}
        disabled={isLoading('google-signup') || googleLogin.isPending}
        className="text-text-primary mx-auto flex h-[50px] w-full cursor-pointer items-center justify-between rounded-[8px] border border-[#E5E5EC] bg-white px-6 py-[15px] text-center text-lg font-medium leading-[1.4] tracking-[-0.025em] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/google.png" alt="Google Icon" width={20} height={20} />
        </div>
        <span>
          {isLoading('google-signup') || googleLogin.isPending
            ? '회원가입 중...'
            : 'Google로 회원가입'}
        </span>
        <div className="h-6 w-6"></div>
      </Button>
      <div className="text-text-tertiary text-center text-sm">
        이미 계정이 있으신가요?{' '}
        <a href="/auth/login" className="text-text-primary font-medium hover:underline">
          로그인
        </a>
      </div>
    </div>
  )
}
