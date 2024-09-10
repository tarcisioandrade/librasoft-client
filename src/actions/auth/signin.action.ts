"use server";

import { signin } from "@/services/session.service";
import { redirect } from "next/navigation";

export async function signinAction(formData: FormData) {
  const formSignin = {
    callbackUrl: formData.get("callbackUrl"),
  };
  const result = await signin(formData);
  if (!result.success) return result;
  redirect(formSignin.callbackUrl!.toString());
}
