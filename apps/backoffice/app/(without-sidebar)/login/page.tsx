import LoginForm from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='bg-muted relative hidden lg:block'>
        <img
          src='/images/LOGIN_BG.png'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
      <div className='flex flex-col p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <img
            src='/images/LOGO_HEADER.svg'
            alt='Nafal Backoffice'
            width={100}
            height={10}
          />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs mt-20'>
            <LoginForm />
          </div>
        </div>
        <div className="mt-6 flex flex-col items-start gap-1 text-sm text-gray-500 w-full max-w-sm">
          <p className="font-semibold">데모 관리자 계정 정보</p>
          <div className="w-full border-t border-gray-300 my-1"></div>
          <p className="font-semibold text-gray-700">최고 관리자 (SUPERADMIN)</p>
          <p>아이디: <span className="font-mono text-gray-800">superadmin</span></p>
          <p>비밀번호: <span className="font-mono text-gray-800">123</span></p>
          <div className="w-full border-t border-gray-300 my-1"></div>
          <p className="font-semibold text-gray-700">일반 관리자 (ADMIN)</p>
          <p>아이디: <span className="font-mono text-gray-800">admin</span></p>
          <p>비밀번호: <span className="font-mono text-gray-800">123</span></p>
        </div>
      </div>
    </div>
  );
}
