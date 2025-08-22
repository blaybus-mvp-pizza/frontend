'use client'

import React from 'react'

import { motion } from 'framer-motion'

interface SuccessModalProps {
  title?: string
  message: string
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title = '성공', message, onClose }) => {
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
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        <p className="mb-6 text-gray-600">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SuccessModal
