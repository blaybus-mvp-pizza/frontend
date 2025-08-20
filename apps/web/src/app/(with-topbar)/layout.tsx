import "@workspace/ui/globals.css";
import { TopNavBar } from "@/components/layouts";
import Footer from "@/components/layouts/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavBar />
      <main className='pt-5 min-h-[100svh] relative max-w-container px-2 md:px-4 mx-auto w-full'>
        {children}
      </main>
      <Footer />
    </>
  );
}
