import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFormSigninModel } from "./form.model";
import ErrorMessage from "@/components/ui/error-message";

type FormSigninProps = ReturnType<typeof useFormSigninModel>;

const FormSignin = ({ submitFn, register, isLoading, errors }: FormSigninProps) => {
  return (
    <form
      onSubmit={submitFn}
      className="mx-auto mt-6 flex flex-col gap-4 rounded border p-6"
      data-testid="form-signin"
    >
      <Label htmlFor="email">Email</Label>
      <Input {...register("email")} required id="email" type="email" autoComplete="email" />
      {errors?.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

      <Label htmlFor="password">Password</Label>
      <Input
        {...register("password")}
        required
        data-testid="input-password"
        id="password"
        type="password"
        autoComplete="current-password"
      />
      {errors?.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

      <Button data-testid="button-test" type="submit" disabled={isLoading}>
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
