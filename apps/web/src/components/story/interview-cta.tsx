import { Button } from '@workspace/ui/components/button';
import { cn } from '@/utils/cn';

export default function InterviewCTA() {
  return (
    <div
      className='
        flex flex-col md:flex-row md:justify-between md:items-center
        p-4 md:p-8
        w-full
        rounded-[4px]
      '
      style={{
        background:
          'linear-gradient(90deg, rgba(148, 239, 255, 0.04) 84.88%, rgba(148, 239, 255, 0.2) 111%), linear-gradient(90deg, rgba(181, 245, 235, 0.04) 69.56%, rgba(181, 245, 235, 0.2) 106.75%), #111111',
      }}
    >
      <div className='flex flex-col gap-1 md:gap-2 mb-4 md:mb-0'>
        <p className={cn(
          'text-sm font-normal leading-[180%] tracking-[-0.025em]',
          'text-brand-mint'
        )}>
          혹시 여러분도 특별한 나팔 스토리를 가지고 계신가요?
        </p>
        <p className={cn(
          'text-[16px] font-semibold leading-[175%] tracking-[-0.025em] md:text-[20px]',
          'text-text-inverse'
        )}>
          나팔 스토리에서 더 많은 재탄생 이야기를 만나보세요.
        </p>
      </div>

      <Button
        className={cn(
          'flex-shrink-0',
          'px-3 py-0 gap-2',
          'w-full md:w-[110px] h-12',
          'rounded-[4px] bg-background-100 text-text-primary',
          'hover:bg-background-200',
          'cursor-pointer'
        )}
        onClick={() => {
          // TODO: 인터뷰 신청하기 동작
          console.log('인터뷰 신청하기');
        }}
      >
        <span className={cn(
          'font-semibold text-[14px] leading-[160%] tracking-[-0.025em]',
          'text-text-primary'
        )}>
          인터뷰 신청하기
        </span>
      </Button>
    </div>
  );
}
