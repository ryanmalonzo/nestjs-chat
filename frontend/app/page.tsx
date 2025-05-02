import AuthGuard from "@/components/auth/auth-guard";

export default function Chat() {
  return (
    <AuthGuard>
      <p>Hello, World!</p>
    </AuthGuard>
  );
}
