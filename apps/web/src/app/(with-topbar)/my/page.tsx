import MyPageContent from "@/components/my/my-page-content";
import { Suspense } from "react";

export default function MyPage() {
  return (
    <div className='max-w-[880px] mx-auto'>
      <div className='py-10 text-center'>
        <div className='font-bold text-2xl text-[--color-foreground-dark]k leading-[140%] tracking-[0%]'>
          마이페이지
        </div>
      </div>
      <Suspense>
        <MyPageContent />
      </Suspense>
    </div>
  );
}
