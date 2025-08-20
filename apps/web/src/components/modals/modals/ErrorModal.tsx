'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ErrorModalProps {
  title?: string;
  message: string;
  details?: any;
  onClose: () => void;
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
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {details && process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
        
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ErrorModal;