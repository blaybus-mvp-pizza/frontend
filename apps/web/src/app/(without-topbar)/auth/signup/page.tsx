import SignupForm from '@/components/auth/signup-form';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col md:p-10'>
        <div className='hidden lg:flex'>
          <Image
            src='/images/LOGO_HEADER.svg'
            alt='Nafal'
            width={144}
            height={48}
          />
        </div>
        <div className='flex flex-1 pt-60 justify-center'>
          <div className='w-full max-w-sm lg:max-w-lg'>
            <div className='flex justify-center mb-8 lg:hidden'>
              <Image
                src='/images/LOGO_HEADER.svg'
                alt='Nafal'
                width={144}
                height={48}
              />
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <Image
          src='/images/LOGIN_BG.png'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          fill={true}
        />
      </div>
    </div>
  );
}
