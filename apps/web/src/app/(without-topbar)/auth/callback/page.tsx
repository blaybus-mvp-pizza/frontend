'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGoogleCallback } from '@/api/hooks/mutations/useAuth';
import { useUIStore } from '@/store/ui.store';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const googleCallback = useGoogleCallback();
  const { showError } = useUIStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      showError('로그인이 취소되었습니다.');
      router.push('/auth/login');
      return;
    }

    if (code) {
      googleCallback.mutate(code);
    } else {
      showError('인증 코드가 없습니다.');
      router.push('/auth/login');
    }
  }, [searchParams, router, googleCallback, showError]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}