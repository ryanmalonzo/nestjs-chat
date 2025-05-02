"use client";

import { RegisterUserDto } from "@/lib/types";
import { AuthForm } from "./auth-form";

export function RegisterForm({
  onSubmit,
}: {
  onSubmit?: ({ email, plainPassword }: RegisterUserDto) => Promise<void>;
}) {
  return (
    <AuthForm
      title="S'inscrire"
      description="Créez votre compte utilisateur"
      submitText="S&#39;inscrire"
      footer={
        <div className="mt-4 text-center text-sm">
          Déjà inscrit ?{" "}
          <a href="/login" className="underline underline-offset-4">
            Se connecter
          </a>
        </div>
      }
      onSubmit={onSubmit}
    />
  );
}
