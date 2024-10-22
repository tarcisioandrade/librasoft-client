"use server";

import { logout } from "@/services/session.service";
import { redirect } from "next/navigation";

export async function logouAction() {
  await logout();
  redirect("/");
}
