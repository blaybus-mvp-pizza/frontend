'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BuyNowModalProps {
  productName: string;
  price: number;
  onClose: () => void;
  onConfirm: () => void;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({
  productName,
  price,
  onClose,
  onConfirm,
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
        <h2 className="text-xl font-bold mb-2">즉시 구매</h2>
        <p className="text-sm text-gray-600 mb-4">{productName}</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-600 mb-1">즉시 구매가</div>
          <div className="text-2xl font-bold text-blue-600">
            {price.toLocaleString()}원
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            즉시 구매를 선택하시면 경매를 종료하고 바로 구매하실 수 있습니다.
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
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
          >
            구매하기
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BuyNowModal;