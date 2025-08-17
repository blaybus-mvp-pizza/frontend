import "@workspace/ui/globals.css";
import { TopNavBar } from "@/components/layouts/top-nav-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="pt-40 max-w-container mx-auto w-full">{children}</main>
    </>
  );
}
