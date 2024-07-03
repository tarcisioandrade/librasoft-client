"use server";

import { signin } from "@/services/session";
import { redirect } from "next/navigation";

export async function signinAction(_prevState: any, formData: FormData) {
  const formSignin = {
    callbackUrl: formData.get("callbackUrl"),
  };

  const result = await signin(formData);

  if (result.success) redirect(formSignin.callbackUrl!.toString());

  return result;
}
