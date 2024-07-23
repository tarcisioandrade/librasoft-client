import env from "@/env";
import { createFetch } from "@better-fetch/fetch";
import { z } from "zod";

export const $fetch = createFetch({
  baseURL: env.BACKEND_URL,
  defaultError: z.object({ errors: z.array(z.string()) }),
});
