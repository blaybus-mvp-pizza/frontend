'use client'

import React from 'react'

import { motion } from 'framer-motion'

interface ErrorModalProps {
  title?: string
  message: string
  details?: any
  onClose: () => void
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  title = '오류가 발생했습니다',
  message,
  details,
  onClose,
}) => {
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
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="mb-4 text-gray-600">{message}</p>

        {details && process.env.NODE_ENV === 'development' && (
          <div className="mb-4 max-h-40 overflow-y-auto rounded-lg bg-gray-100 p-3">
            <pre className="text-xs text-gray-700">{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ErrorModal
