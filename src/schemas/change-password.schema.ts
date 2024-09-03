import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres.")
  .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra.")
  .regex(/\d/, "A senha deve conter pelo menos um número.");

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas digitadas não correspondem.",
    path: ["confirmPassword"],
  });

export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type ChangePasswordInput = Omit<z.infer<typeof changePasswordSchema>, "confirmPassword">;
