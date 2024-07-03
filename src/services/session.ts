import { cookies } from "next/headers";
import { authenticateTokensSchema } from "../schemas/session.schema";
import env from "../env";
import { userSchema } from "../schemas/user.schema";
import { decrypt, encrypt } from "@/lib/jwt";

const DEFAULT_ERROR_MESSAGE =
  "Ocorreu um erro inesperado, por favor, tente novamente.";

export async function signin(formData: FormData) {
  const formSignin = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const request = await fetch(`${env.BACKEND_URL}/authenticate/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formSignin),
  });

  const json = await request.json();

  const tokens = await authenticateTokensSchema.safeParseAsync(json);

  if (!request.ok) {
    return {
      success: false,
      error: {
        message: [json.errors[0] || DEFAULT_ERROR_MESSAGE],
      },
    };
  }

  if (!tokens.success) {
    return {
      success: false,
      error: { message: [DEFAULT_ERROR_MESSAGE] },
    };
  }

  cookies().set({
    name: "access_token",
    secure: process.env.NODE_ENV === "production",
    value: tokens.data.access_token,
    httpOnly: true,
    path: "/",
  });

  const session = await setSession();

  if (!session.success) {
    logout();
    return { success: false, error: session.error };
  }

  return { success: true, error: null };
}

export async function signup(formData: FormData) {
  const formSignup = {
    name: formData.get("name"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    password: formData.get("password"),
  };

  const request = await fetch(`${env.BACKEND_URL}/authenticate/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formSignup),
  });

  if (!request.ok) {
    const json = await request.json();
    return {
      success: false,
      error: {
        message: [json.errors[0] || DEFAULT_ERROR_MESSAGE],
      },
    };
  }

  return {
    success: true,
    error: null,
  };
}

export function logout() {
  cookies().delete("access_token");
  cookies().delete("session");
}

async function setSession() {
  const session = cookies().get("session")?.value;
  const access_token = cookies().get("access_token")?.value;

  if (session || !access_token) {
    return {
      success: false,
      error: { message: ["Access token not found."] },
    };
  }

  const req = await fetch(`${env.BACKEND_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "force-cache",
    next: {
      tags: ["session"],
    },
  });

  const json = await req.json();

  if (!req.ok) {
    return {
      success: false,
      error: { message: [DEFAULT_ERROR_MESSAGE] },
    };
  }

  const parsed = await encrypt(json);

  cookies().set({
    name: "session",
    value: parsed,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return {
    success: true,
    session: parsed,
  };
}

export async function getSession() {
  const sessionEncrypted = cookies().get("session")?.value;
  if (!sessionEncrypted) return null;
  const sessionDecrypted = await decrypt(sessionEncrypted);
  const result = userSchema.parse(sessionDecrypted);

  return { user: result };
}

export async function validateSession() {
  const access_token = cookies().get("access_token")?.value;

  const req = await fetch(`${env.BACKEND_URL}/authenticate/check`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const STATUS_OK_CODE = 200;

  return req.status === STATUS_OK_CODE;
}
