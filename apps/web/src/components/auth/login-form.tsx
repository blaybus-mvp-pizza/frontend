import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';

export default function LoginForm() {
  return (
    <div className='flex flex-col gap-8 w-full max-w-[400px] mx-auto px-4'>
      <div className='flex flex-col items-center gap-2 w-full'>
        <p className='text-lg md:text-[20px] font-normal leading-[1.4] text-center tracking-[-0.025em] text-[#767676] w-full'>
          가치 있는 소비, 특별한 시작
        </p>
        <div className='flex flex-col items-center gap-0.5 w-full'>
          <h1 className='text-xl md:text-[22px] font-bold leading-[1.4] text-center tracking-[-0.025em] text-[#111111]'>
            세상을 바꾸는 소비
          </h1>
          <h1 className='text-xl md:text-[22px] font-bold leading-[1.4] tracking-[-0.025em] text-[#111111]'>
            지금 나팔에서 특별한 변화를 경험하세요.
          </h1>
        </div>
      </div>
      <Button
        className='
          w-full h-[50px] mx-auto
          py-[15px] px-6
          flex items-center justify-between
          bg-white border border-[#E5E5EC] rounded-[8px]
          text-[#111111] font-medium text-lg text-center leading-[1.4] tracking-[-0.025em]
          hover:bg-gray-100
          cursor-pointer
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
        <span>Google로 시작하기</span>
        <div className='w-6 h-6'></div>
      </Button>
    </div>
  );
}
