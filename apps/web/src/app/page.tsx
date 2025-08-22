'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    router.push('/home')
  }, [])
  return <div className="flex min-h-svh items-center justify-center"></div>
}
