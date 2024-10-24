import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormSignupModel } from "./form-signup.model";

type Props = ReturnType<typeof useFormSignupModel>;

const FormSignup = (props: Props) => {
  const { errors, isLoading, register, submitFn } = props;

  return (
    <form onSubmit={submitFn} className="mx-auto mt-6 flex flex-col gap-4 rounded border p-6">
      <Label htmlFor="name">Nome</Label>
      <Input {...register("name")} required id="name" type="name" autoComplete="name" />
      {errors?.name && (
        <p className="text-xs text-destructive" data-testid="error-message">
          {errors.name.message}
        </p>
      )}

      <Label htmlFor="email">Email</Label>
      <Input {...register("email")} required id="email" type="email" autoComplete="email" />
      {errors?.email && (
        <p className="text-xs text-destructive" data-testid="error-message">
          {errors.email.message}
        </p>
      )}

      <Label htmlFor="telephone">Celular</Label>
      <Input {...register("telephone")} required id="telephone" type="tel" autoComplete="tel" />
      {errors?.telephone && (
        <p className="text-xs text-destructive" data-testid="error-message">
          {errors.telephone.message}
        </p>
      )}

      <Label htmlFor="password">Password</Label>
      <Input
        {...register("password")}
        required
        id="password"
        type="password"
        autoComplete="current-password"
      />
      {errors?.password && (
        <p className="text-xs text-destructive" data-testid="error-message">
          {errors.password.message}
        </p>
      )}

      <Button type="submit" disabled={isLoading} data-testid="button-submit">
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
