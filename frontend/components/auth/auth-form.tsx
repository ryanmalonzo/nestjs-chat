import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthFormProps {
  title: string;
  description: string;
  submitText: string;
  footer?: React.ReactNode;
  onSubmit?: (formData: FormData) => Promise<void>;
}

export function AuthForm({
  title,
  description,
  submitText,
  footer,
  onSubmit,
}: AuthFormProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input id="password" name="password" type="password" placeholder="****************" required />
              </div>
              <Button type="submit" className="w-full">
                {submitText}
              </Button>
            </div>
            {footer}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

