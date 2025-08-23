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
      <main className="relative mx-auto min-h-[100vh] w-full px-4">{children}</main>
      <Footer />
    </>
  )
}
