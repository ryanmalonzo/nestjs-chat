"use client";

import { refreshUserData } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
      localStorage.clear();
      router.push("/login");
    }
  };

  useEffect(() => {
    if (pathname && router) {
      checkIfUserIsAuthenticated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  return children;
}
