"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginUserDto, RegisterUserDto } from "@/lib/types";
import { useState } from "react";

interface AuthFormProps {
  title: string;
  description: string;
  submitText: string;
  footer?: React.ReactNode;
  onSubmit?: ({
    email,
    plainPassword,
  }: RegisterUserDto | LoginUserDto) => Promise<void>;
}

export function AuthForm({
  title,
  description,
  submitText,
  footer,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (onSubmit) {
                onSubmit({ email, plainPassword: password });
              }
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="****************"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {submitText}
              </Button>
            </div>
            {footer}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
