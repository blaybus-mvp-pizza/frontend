"use client";

import { Button } from "@workspace/ui/components/button";
import { useState, useEffect, SetStateAction } from "react";
import { ProfileInput } from "./profile-section";

interface PhoneNumberVerificationProps {
  userPhoneNumber: string;
}

export default function PhoneNumberVerification({
  userPhoneNumber,
}: PhoneNumberVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [authCode, setAuthCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setIsTimeExpired(true);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSendAuthCode = () => {
    setIsTimerActive(true);
    setIsTimeExpired(false);
    setTimeLeft(180);
    // TODO: 인증번호 전송 api 호출
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    let formattedValue = "";
    if (rawValue.length < 4) {
      formattedValue = rawValue;
    } else if (rawValue.length < 8) {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else {
      formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }
    setPhoneNumber(formattedValue);
  };

  return (
    <div className='flex flex-col gap-2 mt-1'>
      <div className='flex justify-between items-center'>
        <div className='text-sm font-medium'>연락처</div>
        {isTimeExpired && (
          <p className='text-red-500 text-xs'>
            인증 시간이 만료되었습니다. 다시 시도해 주세요.
          </p>
        )}
      </div>
      <div className='flex gap-2'>
        <div className='relative flex-1'>
          <ProfileInput
            value={phoneNumber}
            className='pr-14'
            type='tel'
            onChange={handlePhoneChange}
          />
          {isTimerActive && (
            <div className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500'>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <Button
          className='h-12 rounded-sm border border-black bg-white text-black px-4 w-[100px] whitespace-nowrap
                    disabled:border-[#999] disabled:bg-[#999] disabled:text-white'
          onClick={handleSendAuthCode}
          disabled={isTimerActive && timeLeft > 0}
        >
          {isTimeExpired ? "재전송" : "인증번호 전송"}
        </Button>
      </div>

      <div className='flex gap-2 relative'>
        <ProfileInput
          className='flex-1 pr-14'
          placeholder='인증번호를 입력해 주세요'
          value={authCode}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setAuthCode(e.target.value)
          }
        />
        <Button
          className='h-12 rounded-sm border w-[100px] whitespace-nowrap
                    bg-black text-brand-mint border-black
                    disabled:border-[#999] disabled:bg-[#999] disabled:text-white'
          disabled={authCode.length !== 6 || timeLeft === 0}
        >
          인증완료
        </Button>
      </div>
    </div>
  );
}
