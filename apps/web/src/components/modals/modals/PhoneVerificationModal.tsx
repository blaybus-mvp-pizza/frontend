'use client'

import React, { useState } from 'react'

import { motion } from 'framer-motion'

interface PhoneVerificationModalProps {
  onClose: () => void
  onConfirm: (phoneNumber: string, code: string) => void
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ onClose, onConfirm }) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending SMS
    setTimeout(() => {
      setIsLoading(false)
      setStep('code')
    }, 1000)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(phoneNumber, verificationCode)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold">휴대폰 인증</h2>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">휴대폰 번호</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">- 없이 숫자만 입력해주세요</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? '전송중...' : '인증번호 전송'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">인증번호</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6자리 숫자"
                maxLength={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {phoneNumber}로 전송된 인증번호를 입력해주세요
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              번호 다시 입력
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
              >
                인증하기
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default PhoneVerificationModal
