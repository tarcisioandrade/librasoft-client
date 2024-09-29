"use client";

import React, { useTransition } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupForm, signupSchema } from "@/schemas/session.schema";
import { Label } from "../../../../components/ui/label";
import { signupAction } from "@/actions/auth/signup.action";

const FormSignup = () => {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", name: "", telephone: "" },
  });

  function submitFn(data: SignupForm) {
    const input = {
      email: data.email,
      password: data.password,
      name: data.name,
      telephone: data.telephone,
    };
    startTransition(async () => {
      const result = await signupAction(input);
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
      <Label htmlFor="name">Nome</Label>
      <Input {...register("name")} required id="name" type="name" autoComplete="name" />
      {errors?.name && <p className="text-xs text-destructive">{errors.name.message}</p>}

      <Label htmlFor="email">Email</Label>
      <Input {...register("email")} required id="email" type="email" autoComplete="email" />
      {errors?.email && <p className="text-xs text-destructive">{errors.email.message}</p>}

      <Label htmlFor="telephone">Celular</Label>
      <Input {...register("telephone")} required id="telephone" type="tel" autoComplete="tel" />
      {errors?.telephone && <p className="text-xs text-destructive">{errors.telephone.message}</p>}

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

export default FormSignup;
