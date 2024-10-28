"use client";

import React, { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePassword, changePasswordSchema } from "@/schemas/change-password.schema";
import { changePasswordAction } from "@/actions/user/change-password.action";
import { toast } from "sonner";
import ErrorMessage from "@/components/ui/error-message";

const ChangePasswordForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [isLoading, startTransition] = useTransition();

  function submitFn(data: ChangePassword) {
    const { confirmPassword, ...rest } = data;
    startTransition(async () => {
      const result = await changePasswordAction(rest);
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success(result.value.message);
      reset();
    });
  }

  return (
    <form className="px-4" onSubmit={handleSubmit(submitFn)}>
      <div className="mt-4 space-y-4">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <div>
              <Label htmlFor="password">Senha atual</Label>
              <Input type="password" id="password" {...field} />
              {errors?.password && (
                <ErrorMessage className="mt-1">{errors.password.message}</ErrorMessage>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          render={({ field }) => (
            <div>
              <Label htmlFor="newPassword">Nova senha (mínimo 6 caracteres e uma letra)</Label>
              <Input type="password" id="newPassword" {...field} />
              {errors?.newPassword && (
                <ErrorMessage className="mt-1">{errors.newPassword.message}</ErrorMessage>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <div>
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input type="password" id="confirmPassword" {...field} />
              {errors?.confirmPassword && (
                <ErrorMessage className="mt-1">{errors.confirmPassword.message}</ErrorMessage>
              )}
            </div>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Atualizar
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
