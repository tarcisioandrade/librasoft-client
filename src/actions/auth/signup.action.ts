"use server";

import { SignupForm } from "@/schemas/session.schema";
import { signup } from "@/services/session.service";
import { redirect } from "next/navigation";

export async function signupAction(input: SignupForm) {
  const result = await signup(input);
  if (!result.success) return result;
  redirect("/signin");
}
