'use client'

import React, { Suspense, lazy } from 'react'

import { Modal, useUIStore } from '@/store/ui.store'

// Lazy load modal components
const modalComponents = {
  confirm: lazy(() => import('./modals/ConfirmModal')),
  bid: lazy(() => import('./modals/BidModal').then(module => ({ default: module.BidModal }))),
  buyNow: lazy(() => import('./modals/BuyNowModal')),
  error: lazy(() => import('./modals/ErrorModal')),
  success: lazy(() => import('./modals/SuccessModal')),
  phoneVerification: lazy(() => import('./modals/PhoneVerificationModal')),
}

interface ModalManagerProps {
  modal: Modal
}

const ModalManager: React.FC<ModalManagerProps> = ({ modal }) => {
  const closeModal = useUIStore((state) => state.closeModal)

  const handleClose = () => {
    modal.onClose?.()
    closeModal(modal.id)
  }

  const handleConfirm = () => {
    modal.onConfirm?.()
    closeModal(modal.id)
  }

  const ModalComponent =
    modal.type === 'custom'
      ? modal.props?.component
      : modalComponents[modal.type as keyof typeof modalComponents]

  if (!ModalComponent) return null

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ModalComponent {...modal.props} onClose={handleClose} onConfirm={handleConfirm} />
    </Suspense>
  )
}

export default ModalManager
