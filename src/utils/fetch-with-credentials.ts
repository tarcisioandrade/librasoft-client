import "server-only";

import env from "@/env";
import { cookies } from "next/headers";
import { BetterFetchOption } from "@better-fetch/fetch";
import { $fetch, FetchErrorResponse } from "@/lib/fetch-base";
import { redirect } from "next/navigation";
import { Constants } from "@/constants";

type FetchReturns<TData> = {
  data: TData | null;
  error: FetchErrorResponse | null;
  response: Response;
};

export async function fetchWithCredentials<TData>(
  path: string,
  options?: BetterFetchOption,
): Promise<FetchReturns<TData>> {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    console.error(`Access token not found. Path=${path}`);
    redirect("/signin");
  }

  let response = new Response();
  let error: FetchErrorResponse | null = null;

  const { data, error: errorResponse } = await $fetch<TData>(`${env.BACKEND_URL}${path}`, {
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
  });

  if (errorResponse) {
    error = {
      ...errorResponse,
      errors: Array.isArray(errorResponse.errors)
        ? errorResponse.errors
        : [Constants.DEFAULT_ERROR_MESSAGE],
    };
  }

  return { data, error, response };
}
