"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { api } from "@/lib/api";
import { JwtResponse, RegisterUserDto } from "@/lib/types";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async ({ email, plainPassword }: RegisterUserDto) => {
    const response = await api.post("auth/register", {
      json: {
        email,
        plainPassword,
      },
    });

    if (!response.ok) {
      toast.error("Erreur lors de l'inscription");
      return;
    }

    const { accessToken } = (await response.json()) as JwtResponse;
    localStorage.setItem("accessToken", accessToken);

    router.push("/chat");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
