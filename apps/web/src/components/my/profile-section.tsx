'use client'

import React, { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

import { useUpdateUserProfile } from '@/api/hooks/mutations/useUserProfile'
import { useUserProfile } from '@/api/hooks/queries/useMyPage'

import { Skeleton } from '../ui/skeleton'
import PhoneNumberVerification from './phone-number-verification'

export default function ProfileSection() {
  const { data: user, isLoading, isPlaceholderData } = useUserProfile()
  const updateProfile = useUpdateUserProfile()
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [isEditingNickname, setIsEditingNickname] = useState(false)

  React.useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname)
    }
  }, [user?.nickname])

  if (isLoading && !isPlaceholderData) {
    return <ProfileSectionSkeleton />
  }

  if (!user) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>
  }

  const handleNicknameUpdate = () => {
    if (nickname && nickname !== user.nickname) {
      updateProfile.mutate(
        {
          nickname,
          phone_number: user.phone_number || null,
          profile_image_url: user.profile_image_url || null,
          is_phone_verified: user.is_phone_verified,
        },
        {
          onSuccess: () => {
            setIsEditingNickname(false)
          },
        },
      )
    }
  }

  return (
    <div className="mb-20 flex w-full flex-col gap-4">
      <div className="text-text-primary text-left text-lg font-semibold leading-[140%] tracking-[0%]">
        프로필 수정
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 p-6">
        <div className="h-14 w-14 overflow-hidden rounded-full">
          <img
            src={user.profile_image_url || '/images/Default_user.webp'}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>
        {/* TODO: 이미지 수정 버튼 동작 */}
        <button className="h-[30px] cursor-pointer rounded border border-[#E5E5EC] bg-white px-[8px] py-[6px] text-[12px] font-semibold text-black shadow-none hover:bg-gray-100">
          이미지 수정
        </button>
        <p className="text-center text-xs font-medium leading-[160%] tracking-[-0.025em] text-gray-400">
          프로필 이미지는 250 x 250 픽셀에 최적화되어 있으며, <br />
          5MB 이하의 JPG, GIF, PNG 파일을 지원합니다.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">닉네임</div>
        <div className="flex gap-2">
          <ProfileInput
            value={isEditingNickname ? nickname : user.nickname}
            disabled={!isEditingNickname}
            readOnly={!isEditingNickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1"
          />
          {isEditingNickname ? (
            <div className="flex gap-2">
              <Button
                className="h-12 rounded-sm border border-gray-200 bg-white px-4 text-black hover:bg-gray-100"
                onClick={() => {
                  setNickname(user.nickname)
                  setIsEditingNickname(false)
                }}
              >
                취소
              </Button>
              <Button
                className="h-12 rounded-sm border border-black bg-black px-4 text-white hover:bg-gray-800"
                onClick={handleNicknameUpdate}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? '저장중...' : '저장'}
              </Button>
            </div>
          ) : (
            <Button
              className="h-12 rounded-sm border border-gray-200 bg-white px-4 text-black hover:bg-gray-100"
              onClick={() => setIsEditingNickname(true)}
            >
              수정
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">이메일</div>
        <ProfileInput value={user.email} disabled={true} readOnly />
      </div>

      <PhoneNumberVerification
        userPhoneNumber={user.phone_number || ''}
        isPhoneVerified={user.is_phone_verified}
      />
    </div>
  )
}

type profileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  type?: string
}

export const ProfileInput = React.forwardRef<HTMLInputElement, profileInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-sm border border-gray-200 px-4 text-sm',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
          'focus:outline-none focus:ring-1 focus:ring-black',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

const ProfileSectionSkeleton = () => (
  <div className="mb-20 flex w-full flex-col gap-4">
    <div className="text-text-primary text-left text-lg font-semibold leading-[140%] tracking-[0%]">
      프로필 수정
    </div>

    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 p-6">
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-72" />
    </div>

    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">닉네임</div>
      <Skeleton className="h-10 w-full" />
    </div>

    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">이메일</div>
      <Skeleton className="h-10 w-full" />
    </div>

    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">연락처</div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  </div>
)
