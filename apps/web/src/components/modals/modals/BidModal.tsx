'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBidMutation } from '@/api/hooks/mutations/useBid';
import { useUIStore } from '@/store/ui.store';

interface BidModalProps {
  auctionId: number;
  productName: string;
  currentBid: number;
  minBidIncrement?: number;
  onClose: () => void;
  onConfirm: () => void;
}

const BidModal: React.FC<BidModalProps> = ({
  auctionId,
  productName,
  currentBid,
  minBidIncrement = 1000,
  onClose,
  onConfirm,
}) => {
  const [bidAmount, setBidAmount] = useState(currentBid + minBidIncrement);
  const bidMutation = useBidMutation();
  const setLoading = useUIStore((state) => state.setLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading('bid', true);
    
    try {
      await bidMutation.mutateAsync({
        auction_id: auctionId,
        amount: bidAmount,
      });
      
      onConfirm();
    } finally {
      setLoading('bid', false);
    }
  };

  const quickBidOptions = [
    currentBid + minBidIncrement,
    currentBid + minBidIncrement * 5,
    currentBid + minBidIncrement * 10,
  ];

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
        <h2 className="text-xl font-bold mb-2">입찰하기</h2>
        <p className="text-sm text-gray-600 mb-4">{productName}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              현재 최고 입찰가
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {currentBid.toLocaleString()}원
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              입찰 금액
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentBid + minBidIncrement}
              step={minBidIncrement}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 입찰 단위: {minBidIncrement.toLocaleString()}원
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              빠른 입찰
            </label>
            <div className="flex gap-2">
              {quickBidOptions.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBidAmount(amount)}
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm transition-colors ${
                    bidAmount === amount
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  +{((amount - currentBid) / 1000).toFixed(0)}천원
                </button>
              ))}
            </div>
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
              disabled={bidMutation.isPending}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {bidMutation.isPending ? '처리중...' : '입찰'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BidModal;