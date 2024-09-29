"use server";

import { SigninForm } from "@/schemas/session.schema";
import { signin } from "@/services/session.service";
import { redirect } from "next/navigation";

type SigninActionProps = {
  callbackUrl: string;
} & SigninForm;

export async function signinAction({ email, password, callbackUrl }: SigninActionProps) {
  const result = await signin({ email, password });
  if (!result.success) return result;
  redirect(callbackUrl);
}
