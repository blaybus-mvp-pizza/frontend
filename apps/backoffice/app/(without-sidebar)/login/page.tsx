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
          <div className='w-full max-w-xs mb-30'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
