import { AuthForm } from "./auth-form";

export function LoginForm({
  onSubmit,
}: {
  onSubmit?: (formData: FormData) => Promise<void>;
}) {
  return (
    <AuthForm
      title="Se connecter"
      description="Connectez-vous à votre compte"
      submitText="Se connecter"
      footer={
        <div className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <a href="/register" className="underline underline-offset-4">
            S&#39;inscrire
          </a>
        </div>
      }
      onSubmit={onSubmit}
    />
  );
}

