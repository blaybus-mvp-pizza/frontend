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
      <main className="relative min-h-[100svh] w-full px-4">{children}</main>
      <Footer />
    </>
  )
}
