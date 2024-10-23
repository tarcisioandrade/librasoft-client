"use server";

import { SigninActionProps } from "@/app/(auth)/signin/components/form-signin/form.type";
import { signin } from "@/services/session.service";
import { redirect } from "next/navigation";

export async function signinAction({ email, password, callbackUrl }: SigninActionProps) {
  const result = await signin({ email, password });
  if (!result.success) return result;
  redirect(callbackUrl);
}
