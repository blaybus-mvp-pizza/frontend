'use client';

import { MyButton } from '@workspace/ui/components/myButton';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/api/hooks/mutations/useAuth';
import { useCurrentUser } from '@/api/hooks/queries/useUser';
import { useEffect } from 'react';

export function AuthBtns() {
  const router = useRouter();
  const { isAuthenticated, user, token, updateUser } = useAuthStore();
  const logoutMutation = useLogout();
  
  // Fetch current user data if authenticated but no user data
  const { data: userData } = useCurrentUser();
  
  useEffect(() => {
    if (userData && !user) {
      updateUser(userData);
    }
  }, [userData, user, updateUser]);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <>
      {isAuthenticated && token ? (
        <>
          <div className="flex items-center gap-2">
            {user && (
              <span className="text-sm text-gray-600 hidden md:inline">
                {user.nickname || user.email}
              </span>
            )}
            <MyButton onClick={() => router.push('/my')} text='마이페이지' />
            <MyButton onClick={handleLogout} text='로그아웃' />
          </div>
        </>
      ) : (
        <MyButton onClick={handleLogin} text='로그인/회원가입' />
      )}
    </>
  );
}
