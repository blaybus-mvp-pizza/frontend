"use client";

import { useUserProfile } from "@/hooks/queries/useMyItems";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "../ui/skeleton";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import PhoneNumberVerification from "./phone-number-verification";

export default function ProfileSection() {
  const { data: user, isLoading, isPlaceholderData } = useUserProfile();

  if (isLoading && !isPlaceholderData) {
    return <ProfileSectionSkeleton />;
  }

  if (!user) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className='flex flex-col w-full gap-4 mb-20'>
      <div className='font-semibold text-lg text-[#111111] leading-[140%] tracking-[0%] text-left'>
        프로필 수정
      </div>

      <div className='flex flex-col justify-center items-center border border-gray-200 rounded-lg p-6 gap-3'>
        <div className='w-14 h-14 rounded-full overflow-hidden'>
          <img
            src={user.profileImageUrl}
            alt='profile'
            className='h-full w-full object-cover'
          />
        </div>
        {/* TODO: 이미지 수정 버튼 동작 */}
        <Button className='px-3 text-[12px] font-semibold shadow-none border border-gray-200 rounded-none bg-white text-black hover:bg-gray-100 cursor-pointer'>
          이미지 수정
        </Button>
        <p className='font-medium text-xs text-gray-400 leading-[160%] tracking-[-0.025em] text-center'>
          프로필 이미지는 250 x 250 픽셀에 최적화되어 있으며, <br />
          5MB 이하의 JPG, GIF, PNG 파일을 지원합니다.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium'>닉네임</div>
        <ProfileInput value={user.nickname} disabled={true} readOnly />
      </div>

      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium'>이메일</div>
        <ProfileInput value={user.email} disabled={true} readOnly />
      </div>

      <PhoneNumberVerification userPhoneNumber={user.phoneNumber || ""} />
    </div>
  );
}

type profileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  type?: string;
};

export const ProfileInput = React.forwardRef<
  HTMLInputElement,
  profileInputProps
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-sm border border-gray-200 px-4 text-sm",
        "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-1 focus:ring-black",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const ProfileSectionSkeleton = () => (
  <div className='flex flex-col w-full gap-4 mb-20'>
    <div className='font-semibold text-lg text-[#111111] leading-[140%] tracking-[0%] text-left'>
      프로필 수정
    </div>

    <div className='flex flex-col justify-center items-center border border-gray-200 rounded-lg p-6 gap-3'>
      <Skeleton className='w-14 h-14 rounded-full' />
      <Skeleton className='h-6 w-24' />
      <Skeleton className='h-4 w-64' />
      <Skeleton className='h-4 w-72' />
    </div>

    <div className='flex flex-col gap-2'>
      <div className='text-sm font-medium'>닉네임</div>
      <Skeleton className='h-10 w-full' />
    </div>

    <div className='flex flex-col gap-2'>
      <div className='text-sm font-medium'>이메일</div>
      <Skeleton className='h-10 w-full' />
    </div>

    <div className='flex flex-col gap-2'>
      <div className='text-sm font-medium'>연락처</div>
      <div className='flex gap-2'>
        <Skeleton className='h-10 w-full flex-1' />
        <Skeleton className='h-10 w-[100px]' />
      </div>
      <div className='flex gap-2'>
        <Skeleton className='h-10 w-full flex-1' />
        <Skeleton className='h-10 w-[100px]' />
      </div>
    </div>
  </div>
);
