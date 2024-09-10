"use server";

import { signup } from "@/services/session.service";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const result = await signup(formData);
  if (!result.success) return result;
  redirect("/signin");
}
