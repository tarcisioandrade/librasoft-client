"use server";

import { signup } from "@/services/session";
import { redirect } from "next/navigation";

export async function signupAction(_prevState: any, formData: FormData) {
  const result = await signup(formData);
  if (result.success === false) return result;
  redirect("/signin");
}
