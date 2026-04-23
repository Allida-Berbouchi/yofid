"use client";
import { getAccessToken } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const destination = getAccessToken() ? "/dashboard" : "/login";
    router.replace(destination);
  }, [router]);

  return null;
}
