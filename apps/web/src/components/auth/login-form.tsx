'use client';

import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';
import { useGoogleLogin } from '@/api/hooks/mutations/useAuth';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/utils/cn';

export default function LoginForm() {
  const googleLogin = useGoogleLogin();
  const { setLoading, isLoading } = useUIStore();

  const handleGoogleLogin = async () => {
    setLoading('google-login', true);
    try {
      await googleLogin.mutateAsync();
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading('google-login', false);
    }
  };

  return (
    <div className='flex flex-col gap-8 w-full max-w-[400px] mx-auto px-4'>
      <div className='flex flex-col items-center gap-2 w-full'>
        <p className={cn(
          'text-lg md:text-[20px] font-normal leading-[1.4] text-center tracking-[-0.025em] w-full',
          'text-text-tertiary'
        )}>
          가치 있는 소비, 특별한 시작
        </p>
        <div className='flex flex-col items-center gap-0.5 w-full'>
          <h1 className={cn(
            'text-xl md:text-[22px] font-bold leading-[1.4] text-center tracking-[-0.025em]',
            'text-text-primary'
          )}>
            세상을 바꾸는 소비
          </h1>
          <h1 className={cn(
            'text-xl md:text-[22px] font-bold leading-[1.4] tracking-[-0.025em]',
            'text-text-primary'
          )}>
            지금 나팔에서 특별한 변화를 경험하세요.
          </h1>
        </div>
      </div>
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading('google-login') || googleLogin.isPending}
        className={cn(
          'w-full h-[50px] mx-auto',
          'py-[15px] px-6',
          'flex items-center justify-between',
          'bg-background-100 border border-border-light rounded-[8px]',
          'text-text-primary font-medium text-lg text-center leading-[1.4] tracking-[-0.025em]',
          'hover:bg-background-200',
          'cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <div className='flex items-center justify-center w-6 h-6'>
          <Image
            src='/icons/google.png'
            alt='Google Icon'
            width={20}
            height={20}
          />
        </div>
        <span>
          {isLoading('google-login') || googleLogin.isPending
            ? '로그인 중...'
            : 'Google로 시작하기'}
        </span>
        <div className='w-6 h-6'></div>
      </Button>
      <div className={cn('text-center text-sm', 'text-text-tertiary')}>
        처음이신가요?{' '}
        <a href='/auth/signup' className={cn('font-medium hover:underline', 'text-text-primary')}>
          회원가입
        </a>
      </div>
    </div>
  );
}
