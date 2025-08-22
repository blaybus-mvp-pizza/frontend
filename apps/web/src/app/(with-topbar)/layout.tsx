import '@workspace/ui/globals.css'

import { TopNavBar } from '@/components/layouts'
import Footer from '@/components/layouts/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <TopNavBar />
      <main className="max-w-container relative mx-auto min-h-[100svh] w-full px-2 pt-5 md:px-4">
        {children}
      </main>
      <Footer />
    </>
  )
}
