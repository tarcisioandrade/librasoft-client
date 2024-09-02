"use server";

import { CacheKeys } from "@/cache-keys";
import { UserUpdate } from "@/schemas/user.schema";
import { setSession } from "@/services/session";
import { UserService } from "@/services/user.service";
import { revalidateTag } from "next/cache";

const userService = new UserService();

export async function updateUserAction(input: UserUpdate) {
  const result = await userService.Update(input);
  if (result.success) {
    revalidateTag(CacheKeys.User.Get);
    const res = await setSession(result.value.user);
    if (!res.success) return res;
  }
  return result;
}
