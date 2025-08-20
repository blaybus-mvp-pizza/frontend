'use client';

import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';
import { useGoogleLogin } from '@/api/hooks/mutations/useAuth';
import { useUIStore } from '@/store/ui.store';

export default function SignupForm() {
  const googleLogin = useGoogleLogin();
  const { setLoading, isLoading } = useUIStore();

  const handleGoogleSignup = async () => {
    setLoading('google-signup', true);
    try {
      // Same OAuth flow for signup as login
      await googleLogin.mutateAsync();
    } catch (error) {
      console.error('Google signup failed:', error);
    } finally {
      setLoading('google-signup', false);
    }
  };

  return (
    <div className='flex flex-col gap-8 w-full max-w-[400px] mx-auto px-4'>
      <div className='flex flex-col items-center gap-2 w-full'>
        <p className='text-lg md:text-[20px] font-normal leading-[1.4] text-center tracking-[-0.025em] text-[#767676] w-full'>
          나팔과 함께 시작하는 의미 있는 소비
        </p>
        <div className='flex flex-col items-center gap-0.5 w-full'>
          <h1 className='text-xl md:text-[22px] font-bold leading-[1.4] text-center tracking-[-0.025em] text-[#111111]'>
            회원가입하고
          </h1>
          <h1 className='text-xl md:text-[22px] font-bold leading-[1.4] tracking-[-0.025em] text-[#111111]'>
            특별한 쇼핑 경험을 시작하세요.
          </h1>
        </div>
      </div>
      <Button
        onClick={handleGoogleSignup}
        disabled={isLoading('google-signup') || googleLogin.isPending}
        className='
          w-full h-[50px] mx-auto
          py-[15px] px-6
          flex items-center justify-between
          bg-white border border-[#E5E5EC] rounded-[8px]
          text-[#111111] font-medium text-lg text-center leading-[1.4] tracking-[-0.025em]
          hover:bg-gray-100
          cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
        '
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
          {isLoading('google-signup') || googleLogin.isPending
            ? '회원가입 중...'
            : 'Google로 회원가입'}
        </span>
        <div className='w-6 h-6'></div>
      </Button>
      <div className='text-center text-sm text-[#767676]'>
        이미 계정이 있으신가요?{' '}
        <a href='/auth/login' className='text-[#111111] font-medium hover:underline'>
          로그인
        </a>
      </div>
    </div>
  );
}