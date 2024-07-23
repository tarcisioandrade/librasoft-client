import "server-only";

import env from "@/env";
import { cookies } from "next/headers";
import { betterFetch, BetterFetchOption } from "@better-fetch/fetch";

type FetchError = {
  message?: string | undefined;
  status: number;
  statusText: string;
} | null;

type FetchReturns<TData> = {
  data: TData | null;
  error: FetchError;
  response: Response;
};

export async function fetchWithCredentials<TData>(
  path: string,
  options?: BetterFetchOption,
): Promise<FetchReturns<TData>> {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) throw new Error("Acces token not found.");

  let response = new Response();

  const { data, error } = await betterFetch<TData>(
    `${env.BACKEND_URL}${path}`,
    {
      ...options,
      headers: {
        ...options?.headers,
      },
      auth: {
        type: "Bearer",
        token: access_token,
      },
      onResponse(context) {
        response = context.response;
        return context.response;
      },
    },
  );

  return { data, error, response };
}
