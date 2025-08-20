'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PhoneVerificationModalProps {
  onClose: () => void;
  onConfirm: (phoneNumber: string, code: string) => void;
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending SMS
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 1000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(phoneNumber, verificationCode);
  };

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
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">휴대폰 인증</h2>
        
        {step === 'phone' ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                휴대폰 번호
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                - 없이 숫자만 입력해주세요
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
              >
                {isLoading ? '전송중...' : '인증번호 전송'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                인증번호
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6자리 숫자"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {phoneNumber}로 전송된 인증번호를 입력해주세요
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-sm text-blue-600 hover:underline mb-4"
            >
              번호 다시 입력
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                인증하기
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PhoneVerificationModal;