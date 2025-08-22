import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function calculateRemainingTime(ends_at: string | Date): string {
 if (!ends_at) return '경매 종료'
 
 const endTime = typeof ends_at === 'string' ? new Date(ends_at).getTime() : ends_at.getTime()
 const now = Date.now()
 const remainingTime = endTime - now

 if (remainingTime <= 0) return '경매 종료'

 const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
 const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24)
 const minutes = Math.floor((remainingTime / (1000 * 60)) % 60)
 const seconds = Math.floor((remainingTime / 1000) % 60)

 if (days > 0) {
   return `${days * 24 + hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
 }
 return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
