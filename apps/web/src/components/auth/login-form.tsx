'use client'

import Image from 'next/image'

import { Button } from '@workspace/ui/components/button'

import { useGoogleLogin } from '@/api/hooks/mutations/useAuth'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/utils/cn'

export default function LoginForm() {
  const googleLogin = useGoogleLogin()
  const { setLoading, isLoading } = useUIStore()

  const handleGoogleLogin = async () => {
    setLoading('google-login', true)
    try {
      await googleLogin.mutateAsync()
    } catch (error) {
      console.error('Google login failed:', error)
    } finally {
      setLoading('google-login', false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8 px-4">
      <div className="flex w-full flex-col items-center gap-2">
        <p
          className={cn(
            'w-full text-center text-lg font-normal leading-[1.4] tracking-[-0.025em] md:text-[20px]',
            'text-text-tertiary',
          )}
        >
          가치 있는 소비, 특별한 시작
        </p>
        <div className="flex w-full flex-col items-center gap-0.5">
          <h1
            className={cn(
              'text-center text-xl font-bold leading-[1.4] tracking-[-0.025em] md:text-[22px]',
              'text-text-primary',
            )}
          >
            세상을 바꾸는 소비
          </h1>
          <h1
            className={cn(
              'text-xl font-bold leading-[1.4] tracking-[-0.025em] md:text-[22px]',
              'text-text-primary',
            )}
          >
            지금 나팔에서 특별한 변화를 경험하세요.
          </h1>
        </div>
      </div>
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading('google-login') || googleLogin.isPending}
        className={cn(
          'mx-auto h-[50px] w-full',
          'px-6 py-[15px]',
          'flex items-center justify-between',
          'bg-background-100 border-border-light rounded-[8px] border',
          'text-text-primary text-center text-lg font-medium leading-[1.4] tracking-[-0.025em]',
          'hover:bg-background-200',
          'cursor-pointer',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/google.png" alt="Google Icon" width={20} height={20} />
        </div>
        <span>
          {isLoading('google-login') || googleLogin.isPending
            ? '로그인 중...'
            : 'Google로 시작하기'}
        </span>
        <div className="h-6 w-6"></div>
      </Button>
      <div className={cn('text-center text-sm', 'text-text-tertiary')}>
        처음이신가요?{' '}
        <a href="/auth/signup" className={cn('font-medium hover:underline', 'text-text-primary')}>
          회원가입
        </a>
      </div>
    </div>
  )
}
