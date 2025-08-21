"use client";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
  return <div className="flex items-center justify-center min-h-svh"></div>;
}
