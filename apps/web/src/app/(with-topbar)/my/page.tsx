import { Suspense } from 'react'

import MyPageContent from '@/components/my/my-page-content'

export default function MyPage() {
  return (
    <div className="mx-auto max-w-[880px]">
      <div className="py-10 text-center">
        <div className="text-[--color-foreground-dark]k text-2xl font-semibold leading-[140%] tracking-[0%]">
          마이페이지
        </div>
      </div>
      <Suspense>
        <MyPageContent />
      </Suspense>
    </div>
  )
}
