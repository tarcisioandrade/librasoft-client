"use server";

import { ChangePassword, ChangePasswordInput } from "@/schemas/change-password.schema";
import { UserService } from "@/services/user.service";

const userService = new UserService();

export async function changePasswordAction(input: ChangePasswordInput) {
  const result = await userService.ChangePassword(input);
  return result;
}
