'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { LogIn, UserPlus } from 'lucide-react'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
  redirectPath?: string
}

export function LoginRequiredModal({ 
  isOpen, 
  onClose, 
  message = '이 기능을 사용하려면 로그인이 필요합니다.',
  redirectPath
}: LoginRequiredModalProps) {
  const router = useRouter()

  const handleLogin = () => {
    // 현재 경로를 저장하여 로그인 후 돌아올 수 있도록 함
    const currentPath = redirectPath || window.location.pathname
    router.push(`/auth/login?from=${encodeURIComponent(currentPath)}`)
    onClose()
  }

  const handleSignup = () => {
    const currentPath = redirectPath || window.location.pathname
    router.push(`/auth/signup?from=${encodeURIComponent(currentPath)}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            로그인이 필요합니다
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleLogin}
            className="w-full gap-2"
            size="lg"
          >
            <LogIn className="h-4 w-4" />
            로그인
          </Button>
          
          <Button 
            onClick={handleSignup}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <UserPlus className="h-4 w-4" />
            회원가입
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-500 pt-2">
          로그인하시면 입찰 및 구매가 가능합니다
        </div>
      </DialogContent>
    </Dialog>
  )
}