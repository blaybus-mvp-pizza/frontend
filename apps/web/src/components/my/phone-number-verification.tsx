'use client'

import { SetStateAction, useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'

import { useSendPhoneVerificationSMS, useVerifyPhone } from '@/api/hooks/mutations/useUserProfile'

import { ProfileInput } from './profile-section'
import { useRouter } from 'next/navigation'

interface PhoneNumberVerificationProps {
  userPhoneNumber: string
}

export default function PhoneNumberVerification({ userPhoneNumber }: PhoneNumberVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber)
  const [authCode, setAuthCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(180)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isTimeExpired, setIsTimeExpired] = useState(false)
  
  const sendSMS = useSendPhoneVerificationSMS()
  const verifyPhone = useVerifyPhone()

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null
    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      setIsTimeExpired(true)
    }

    return () => {
      if (timerId) {
        clearInterval(timerId)
      }
    }
  }, [isTimerActive, timeLeft])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (time % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handleSendAuthCode = () => {
    const rawPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    sendSMS.mutate(rawPhoneNumber, {
      onSuccess: () => {
        setIsTimerActive(true)
        setIsTimeExpired(false)
        setTimeLeft(180)
      },
    })
  }
  
  const handleVerifyCode = () => {
    const rawPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    verifyPhone.mutate({
      phone_number: rawPhoneNumber,
      code6: authCode,
    })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 11)
    let formattedValue = ''
    if (rawValue.length < 4) {
      formattedValue = rawValue
    } else if (rawValue.length < 8) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`
    } else {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`
    }
    setPhoneNumber(formattedValue)
  }

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">연락처</div>
        {isTimeExpired && (
          <p className="text-xs text-red-500">인증 시간이 만료되었습니다. 다시 시도해 주세요.</p>
        )}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ProfileInput
            value={phoneNumber}
            className="pr-14"
            type="tel"
            onChange={handlePhoneChange}
          />
          {isTimerActive && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500">
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <Button
          className="h-12 w-[100px] whitespace-nowrap rounded-sm border border-black bg-white px-4 text-black disabled:border-[#999] disabled:bg-[#999] disabled:text-white hover:bg-white"
          onClick={handleSendAuthCode}
          disabled={(isTimerActive && timeLeft > 0) || sendSMS.isPending}
        >
          {sendSMS.isPending ? '전송중...' : isTimeExpired ? '재전송' : '인증번호 전송'}
        </Button>
      </div>

      <div className="relative flex gap-2">
        <ProfileInput
          className="flex-1 pr-14"
          placeholder="인증번호를 입력해 주세요"
          value={authCode}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setAuthCode(e.target.value)
          }
        />
        <Button
          className="text-brand-mint h-12 w-[100px] whitespace-nowrap rounded-sm border border-black bg-black disabled:border-[#999] disabled:bg-[#999] disabled:text-white"
          disabled={authCode.length !== 6 || timeLeft === 0 || verifyPhone.isPending}
          onClick={handleVerifyCode}
        >
          {verifyPhone.isPending ? '확인중...' : '인증완료'}
        </Button>
      </div>
    </div>
  )
}
