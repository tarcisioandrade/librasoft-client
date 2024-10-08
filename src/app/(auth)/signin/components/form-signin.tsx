"use client";

import { signinAction } from "@/actions/auth/signin.action";
import { useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SigninForm, signinSchema } from "@/schemas/session.schema";
import { Label } from "../../../../components/ui/label";

const FormSignin = () => {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const callbackUrl = useSearchParams().get("callbackUrl");

  function submitFn(data: SigninForm) {
    const input = {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl || "/",
    };
    startTransition(async () => {
      const result = await signinAction(input);
      if (!result.success) {
        toast.error(result.error.message);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submitFn)}
      className="mx-auto mt-6 flex flex-col gap-4 rounded border p-6"
    >
      <Label htmlFor="email">Email</Label>
      <Input {...register("email")} required id="email" type="email" autoComplete="email" />
      {errors?.email && <p className="text-xs text-destructive">{errors.email.message}</p>}

      <Label htmlFor="password">Password</Label>
      <Input
        {...register("password")}
        required
        id="password"
        type="password"
        autoComplete="current-password"
      />
      {errors?.password && <p className="text-xs text-destructive">{errors.password.message}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando" : "Enviar"}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Ao continuar, você concorda com as Condições de Uso da LibraSoft. Por favor verifique a
        Notificação de Privacidade, Notificação de Cookies e a Notificação de Anúncios Baseados em
        Interesse.
      </p>
    </form>
  );
};

export default FormSignin;
