"use client";

import { LoginForm } from "@/components/auth/login-form";
import { api } from "@/lib/api";
import { JwtResponse, LoginUserDto } from "@/lib/types";
import { refreshUserData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async ({ email, plainPassword }: LoginUserDto) => {
    const response = await api.post("auth/login", {
      json: {
        email,
        plainPassword,
      },
    });

    if (!response.ok) {
      toast.error("Adresse mail ou mot de passe incorrect");
      return;
    }

    const { accessToken } = (await response.json()) as JwtResponse;
    localStorage.setItem("accessToken", accessToken);

    await refreshUserData();

    router.push("/chat");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
