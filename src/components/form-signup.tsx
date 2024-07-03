"use client";

import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { SignupForm, signupSchema } from "@/schemas/session.schema";
import { Label } from "./ui/label";
import { signupAction } from "@/actions/signup-action";

const FormSignup = () => {
  const [state, formAction, isPending] = useFormState(signupAction, {
    success: false,
    error: null,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", name: "", telephone: "" },
  });

  useEffect(() => {
    if (!state.success && state.error) {
      toast(state.error.message);
    }
  }, [state.error?.message]);

  const onSubmit: () => void = handleSubmit(async (data: SignupForm) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    formData.append("telephone", data.telephone);
    formAction(formData);
  });

  return (
    <form
      action={onSubmit}
      className="mx-auto mt-6 flex flex-col gap-4 rounded border p-6"
    >
      <Label htmlFor="name">Nome</Label>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            required
            id="name"
            type="name"
            autoComplete="name"
          />
        )}
      />
      {errors?.name && (
        <p className="text-xs text-destructive">{errors.name.message}</p>
      )}
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
      <Label htmlFor="telephone">Celular</Label>
      <Controller
        name="telephone"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            required
            id="telephone"
            type="tel"
            autoComplete="tel"
          />
        )}
      />
      {errors?.telephone && (
        <p className="text-xs text-destructive">{errors.telephone.message}</p>
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

export default FormSignup;
