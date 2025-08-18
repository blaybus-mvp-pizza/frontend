'use client';

import { useStory } from '@/hooks/queries/useStories';
import { Button } from '@workspace/ui/components/button';
import { useRouter } from 'next/navigation';
import { format } from 'timeago.js';
import '@/lib/timeage-ko.js';
import InterviewCTA from './interview-cta';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoryContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: story, isLoading, isPlaceholderData } = useStory(Number(id));

  if (!story || (isLoading && !isPlaceholderData))
    return <StoryContentSkeleton />;

  const mainImage = story.images?.[0]?.imageUrl || '/placeholder.png';
  const popupStore = story.product?.popupStore;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <div className='relative w-full h-[300px] overflow-hidden bg-muted'>
        <img
          src={mainImage}
          alt={story.title}
          className='h-full w-full object-cover transition-transform group-hover:scale-105'
        />
      </div>
      <div className='px-4 sm:px-0'>
        <div className='flex flex-col gap-4 mt-4 mb-4'>
          <div className='font-medium text-sm text-[#767676] leading-[160%] tracking-[-0.025em]'>
            {format(story.createdAt, 'ko')}
          </div>
          <div className='font-semibold text-2xl text-[#111111] leading-[140%] tracking-[-0.025em]'>
            {story.title}
          </div>
        </div>
        <div className='bg-[#F5F5F5] w-full p-4 flex items-start space-x-4'>
          <div className='relative w-10 h-10 rounded-sm overflow-hidden shrink-0'>
            <img
              src={popupStore.bannerImageUrl || '/placeholder.png'}
              alt={popupStore.name}
              className='w-full h-full object-cover rounded-sm'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-semibold text-[#111111] line-clamp-1'>
              {popupStore.name}
            </span>
            <span className='text-[13px] font-normal text-[#505050] leading-[150%] tracking-[-0.025em] line-clamp-2'>
              {popupStore.description}
            </span>
          </div>
        </div>
      </div>
      <div className='border-t-2 border-[#111111] my-10'></div>

      {/* #TODO: 컨텐츠 html로 */}
      <Content />

      <InterviewCTA />

      <div className='flex justify-center px-4 pb-3'>
        <Button
          onClick={handleGoBack}
          className='h-12 mt-12 bg-[#52565B] text-white text-sm font-bold cursor-pointer'
        >
          목록 돌아가기
        </Button>
      </div>
    </>
  );
}

function Content() {
  return (
    <div className='px-4 sm:px-0'>
      <h1 className='text-[18px] font-bold mt-8 mb-4'>
        버려진 뻔한 순간, 나팔을 만나다
      </h1>
      <p className='text-[14px] text-gray-600 mb-6'>
        성수동에 문을 열었던 카누 팝업스토어.
        <br />
        한 달간 수많은 사람들이 다녀가며 기념사진을 찍고, 추억을 남겼던
        공간이었지만 행사 종료와 함께 그 안에 있던
        <br />
        굿즈와 소품들은 모두 '폐기 예정'이었습니다.
        <br />
        브랜드 로고가 새겨진 네온사인, 감각적인 컬러감의 테이블과 의자, 그리고
        팝업스토어를 상징하는 한정판 소품들까지.
        <br />
        한때 사람들의 관심과 사랑을 받았던 오브제들이 단숨에 '쓰레기'로 전락할
        뻔했죠.
      </p>

      <div className='border-t-2 border-[#F1F1F5] my-10'></div>

      <h2 className='text-[18px] font-bold mb-4'>새로운 주인을 찾은 굿즈들</h2>
      <p className='text-[14px] text-gray-600 mb-6'>
        나팔은 이 물건들의 '다음 이야기'를 만들어 주고 싶었습니다.
        <br />
        그래서 해당 물품들을 정식 유통 구조 속에서 경매로 선보였고, 그중 일부는
        한 동네 카페로 옮겨갔습니다.
        <br />이 카페는 오래된 주택을 개조해 운영되는 공간으로, 따뜻한 분위기를
        지향했지만 예산의 한계로 특별한 인테리어 소품을 들이기 어려웠습니다.
      </p>
      <p className='text-[14px] text-gray-600 mb-6'>
        그런데 나팔 경매를 통해 합리적인 가격에 가구와 소품을 확보하면서, 카페는
        전혀 다른 공간으로 바뀌게 되었습니다.
      </p>

      <div className='border-t-2 border-[#F1F1F5] my-10'></div>

      <h2 className='text-[18px] font-bold mb-4'>카페가 품은 새로운 이야기</h2>
      <p className='text-[14px] text-gray-600 mb-6'>
        테이블과 의자는 카페 한쪽 구석에 자리 잡았고,
        <br />
        브랜드 네온사인 벽면에 설치되어 카페의 시그니처 포인트가 되었습니다.
        <br />
        손님들은 “이 소품 어디서 가져온 거예요?”라며 관심을 보였고, 자연스럽게
        나팔의 이야기를 공유하게 되었죠.
        <br />
        결국 SNS에 사진이 올라가며 작은 동네 카페가 ‘브랜딩 공간’으로
        재탄생했습니다.
      </p>

      <div className='border-t-2 border-[#F1F1F5] my-10'></div>

      <h2 className='text-[18px] font-bold mb-4'>가치 소비의 확산</h2>
      <p className='text-[14px] text-gray-600 mb-6'>
        이 사례는 단순히 가구를 재활용한 것이 아닙니다.
        <br />
        “버려질 뻔한 물건이 새로운 주인을 만나 또 다른 가치를 만들어낸다”는,
        나팔이 추구하는 철학이 현실에서 구현된 장면이었죠.
        <br />
        사용자에게는 합리적인 소비 경험이었고, 카페에게는 새로운 고객 유입의
        기회가 되었으며, 브랜드에게는 ‘가치 있는 순환’이라는 이야기가
        남았습니다.
      </p>

      <div className='border-t-2 border-[#F1F1F5] my-10'></div>

      <h2 className='text-[18px] font-bold mb-4'>나팔이 만들어가는 변화</h2>
      <p className='text-[14px] text-gray-600 mb-6'>
        나팔은 앞으로도 버려질 위기에 놓인 자원들을 연결해, 새로운 이야기와
        가치를 만들어가고자 합니다.
        <br />
        우리는 단순한 거래 플랫폼이 아니라, 사라질 뻔한 것들의 두 번째 기회를
        만들어주는 파트너입니다.
        <br />
        <br />
        당신이 선택한 소비가 누군가의 공간을 바꾸고, 지구의 자원을 지켜내며,
        브랜드의 이야기를 다시 이어갑니다.
        <br />
        그것이 바로 나팔이 지향하는 새로운 소비의 전환입니다.
      </p>

      <div className='border-t-2 border-[#F1F1F5] my-10'></div>
    </div>
  );
}

const StoryContentSkeleton = () => {
  return (
    <div>
      <Skeleton className='w-full h-[300px] mb-8' />
      <div className='flex flex-col gap-2 mt-4 mb-4'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-3/4' />
      </div>
      <div className='flex items-start space-x-4 p-4'>
        <Skeleton className='w-10 h-10 rounded-sm shrink-0' />
        <div className='flex flex-col gap-1 w-full'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </div>
      <Skeleton className='w-full h-1 my-10' />
      <div className='my-10 space-y-4'>
        <Skeleton className='h-6 w-1/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-11/12' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-10/12' />
      </div>
      <Skeleton className='w-full h-1 my-10' />
      <div className='my-10 space-y-4'>
        <Skeleton className='h-6 w-1/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-11/12' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-10/12' />
      </div>
      <Skeleton className='w-full h-24 my-10 rounded-lg' />
      <div className='flex justify-center px-4 pb-3'>
        <Skeleton className='h-12 w-48 mt-12' />
      </div>
    </div>
  );
};
