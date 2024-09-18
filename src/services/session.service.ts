import "server-only";

import { cookies } from "next/headers";
import { authenticateTokensSchema } from "../schemas/session.schema";
import env from "../env";
import { decrypt, encrypt } from "@/lib/jwt";
import { $fetch } from "@/lib/fetch-base";
import { Constants } from "@/constants";
import { Err, Ok } from "@/utils/result";
import { CacheKeys } from "@/cache-keys";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { User } from "@/types/User";

export type Session = { user: User } | null;

export async function signin(formData: FormData) {
  const formSignin = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { data, error } = await $fetch(`${env.BACKEND_URL}/authenticate/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formSignin),
    output: authenticateTokensSchema,
  });

  if (error) {
    return Err({
      message: [error.errors ?? Constants.DEFAULT_ERROR_MESSAGE],
    });
  }

  cookies().set({
    name: "access_token",
    secure: process.env.NODE_ENV === "production",
    value: data.access_token,
    httpOnly: true,
    path: "/",
  });

  const session = await setSession();

  if (!session.success) {
    logout();
    return Err(session.error);
  }

  return Ok(null);
}

export async function signup(formData: FormData) {
  const formSignup = {
    name: formData.get("name"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    password: formData.get("password"),
  };

  const { error } = await $fetch(`${env.BACKEND_URL}/authenticate/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formSignup),
  });

  if (error) {
    return Err({
      message: [error.errors || Constants.DEFAULT_ERROR_MESSAGE],
    });
  }

  return Ok(null);
}

export function logout() {
  cookies().delete("access_token");
  cookies().delete("session");
}

export async function setSession(user?: User) {
  const access_token = cookies().get("access_token")?.value;

  let data = user;

  if (!access_token) {
    return Err({ message: ["Token de acesso não encontrado."] });
  }

  if (!data) {
    const { data: userInDb, error } = await fetchWithCredentials<User>(`/user`, {
      method: "GET",
      cache: "force-cache",
      next: {
        tags: [CacheKeys.User.Get],
      },
    });
    if (error) {
      return Err({ message: error.errors });
    }
    data = userInDb!;
  }

  const parsed = await encrypt(data);

  cookies().set({
    name: "session",
    value: parsed,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return Ok(parsed);
}

export async function getSession(): Promise<Session> {
  const sessionEncrypted = cookies().get("session")?.value;
  if (!sessionEncrypted) return null;
  const sessionDecrypted = (await decrypt(sessionEncrypted)) as User;

  return { user: sessionDecrypted };
}

export async function validateSession() {
  const access_token = cookies().get("access_token")?.value;
  if (!access_token) return false;
  const { response } = await fetchWithCredentials(`/authenticate/check`);
  return response.ok;
}
