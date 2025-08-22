'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, Phone } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@/utils/cn'

interface PhoneVerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PhoneVerificationModal({ isOpen, onClose }: PhoneVerificationModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleGoToMyPage = () => {
    onClose()
    router.push('/my')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">휴대폰 인증이 필요합니다</h2>
              <p className="text-sm text-gray-500 mt-1">
                안전한 거래를 위해 휴대폰 인증이 필요합니다
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Phone className="w-8 h-8 text-gray-600" />
              </div>
              
              <p className="text-gray-700 mb-2">
                경매 참여 및 즉시구매를 위해서는
              </p>
              <p className="text-gray-700 mb-6">
                휴대폰 인증이 완료되어야 합니다.
              </p>

              <div className="bg-blue-50 rounded-lg p-4 w-full">
                <p className="text-sm text-blue-800">
                  💡 마이페이지에서 간단한 인증 절차를 완료하시면
                  <br />
                  모든 서비스를 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <Button
              onClick={onClose}
              className={cn(
                'flex-1 h-12 rounded-md border border-gray-300',
                'bg-white text-gray-700',
                'hover:bg-gray-50'
              )}
            >
              나중에 하기
            </Button>
            <Button
              onClick={handleGoToMyPage}
              className={cn(
                'flex-1 h-12 rounded-md',
                'bg-black text-white',
                'hover:bg-gray-800'
              )}
            >
              마이페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}