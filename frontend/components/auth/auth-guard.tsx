"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { refreshUserData } from "@/lib/utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const checkIfUserIsAuthenticated = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    const isUserAuthenticated = await refreshUserData();

    if (!isUserAuthenticated) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  useEffect(() => {
    if (pathname && router) {
      checkIfUserIsAuthenticated();
    }
  }, [pathname, router]);

  return children;
}
