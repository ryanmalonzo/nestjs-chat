"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const checkIfUserIsAuthenticated = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.get("users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      router.push("/login");
    } else if (pathname === "/login" || pathname === "/register") {
      router.push("/chat");
    }
  };

  useEffect(() => {
    if (pathname && router) {
      checkIfUserIsAuthenticated();
    }
  }, [pathname, router]);

  return children;
}
