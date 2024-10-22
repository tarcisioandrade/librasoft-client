import "server-only";

import { cookies } from "next/headers";
import { authenticateTokensSchema, SigninForm, SignupForm } from "../schemas/session.schema";
import env from "../env";
import { decrypt, encrypt } from "@/lib/jwt";
import { $fetch } from "@/lib/fetch-base";
import { Constants } from "@/constants";
import { Err, Ok } from "@/utils/result";
import { CacheKeys } from "@/cache-keys";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { User } from "@/types/User";

export type Session = { user: User } | null;

export async function signin(input: SigninForm) {
  const formSignin = {
    email: input.email,
    password: input.password,
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

  (await cookies()).set({
    name: "access_token",
    secure: process.env.NODE_ENV === "production",
    value: data.access_token,
    httpOnly: true,
    path: "/",
  });

  const session = await setSession();

  if (!session.success) {
    await logout();
    return Err(session.error);
  }

  return Ok(null);
}

export async function signup(input: SignupForm) {
  const formSignup = {
    name: input.name,
    email: input.email,
    telephone: input.telephone,
    password: input.password,
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

export async function logout() {
  const cookiesService = await cookies();

  cookiesService.delete("access_token");
  cookiesService.delete("session");
}

export async function setSession(user?: User) {
  const cookiesService = await cookies();

  const access_token = cookiesService.get("access_token")?.value;

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

  cookiesService.set({
    name: "session",
    value: parsed,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return Ok(parsed);
}

export async function getSession(): Promise<Session> {
  const sessionEncrypted = (await cookies()).get("session")?.value;
  if (!sessionEncrypted) return null;
  const sessionDecrypted = (await decrypt(sessionEncrypted)) as User;

  return { user: sessionDecrypted };
}

export async function validateSession() {
  const access_token = (await cookies()).get("access_token")?.value;
  if (!access_token) return false;
  const { response } = await fetchWithCredentials(`/authenticate/check`);
  return response.ok;
}
