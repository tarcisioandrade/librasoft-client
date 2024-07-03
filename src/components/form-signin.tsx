"use client";

import { signinAction } from "@/actions/signin-action";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { SignForm, signinSchema } from "@/schemas/session.schema";
import { Label } from "./ui/label";

const FormSignin = () => {
  const [state, formAction, isPending] = useFormState(signinAction, {
    success: false,
    error: null,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const callbackUrl = useSearchParams().get("callbackUrl");

  useEffect(() => {
    if (!state.success && state.error) {
      toast(state.error.message);
    }
  }, [state.error?.message]);

  const onSubmit: () => void = handleSubmit(async (data: SignForm) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("callbackUrl", callbackUrl || "/");
    formAction(formData);
  });

  return (
    <form
      action={onSubmit}
      className="mx-auto mt-6 flex flex-col gap-4 rounded border p-6"
    >
      <Label htmlFor="email">Email</Label>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            required
            id="email"
            type="email"
            autoComplete="email"
          />
        )}
      />
      {errors?.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
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
      {errors?.password && (
        <p className="text-xs text-destructive">{errors.password.message}</p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enviando" : "Enviar"}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Ao continuar, você concorda com as Condições de Uso da LibraSoft. Por
        favor verifique a Notificação de Privacidade, Notificação de Cookies e a
        Notificação de Anúncios Baseados em Interesse.
      </p>
    </form>
  );
};

export default FormSignin;
