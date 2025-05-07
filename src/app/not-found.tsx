"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootNotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the English 404 page by default
    router.replace("/en/not-found");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
