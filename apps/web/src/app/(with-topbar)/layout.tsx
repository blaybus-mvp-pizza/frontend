import "@workspace/ui/globals.css";
import { TopNavBar } from "@/components/layouts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavBar />
      <main className="pt-40 relative max-w-container px-2 md:px-4 mx-auto w-full">
        {children}
      </main>
    </>
  );
}
