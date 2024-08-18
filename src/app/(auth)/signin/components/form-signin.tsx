"use client";

import { signinAction } from "@/actions/auth/signin.action";
import { useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { SignForm, signinSchema } from "@/schemas/session.schema";
import { Label } from "../../../../components/ui/label";

const FormSignin = () => {
  const [isLoading, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const callbackUrl = useSearchParams().get("callbackUrl");

  function submitFn(data: SignForm) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("callbackUrl", callbackUrl || "/");

    startTransition(async () => {
      const result = await signinAction(formData);
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
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input {...field} required id="email" type="email" autoComplete="email" />
        )}
      />
      {errors?.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      <Label htmlFor="password">Password</Label>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            required
            id="password"
            type="password"
            autoComplete="current-password"
          />
        )}
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
