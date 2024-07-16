import "server-only";

import env from "@/env";
import { cookies } from "next/headers";

export async function fetchWithCredentials<TData>(
  path: string,
  options?: RequestInit,
): Promise<{ data: TData | null; response: Response }> {
  let response: Response = new Response();
  let data: TData | null = null;

  try {
    const access_token = cookies().get("access_token")?.value;
    response = await fetch(`${env.BACKEND_URL}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!access_token) throw new Error("Acces token not found.");
    if (response.status === 200) data = (await response.json()) as TData;
  } catch (error) {
    console.log("error", error);
    throw error;
  } finally {
    return { response, data };
  }
}
