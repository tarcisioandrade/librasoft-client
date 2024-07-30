import { createFetch } from "@better-fetch/fetch";
import { z } from "zod";

const fetchErrorSchema = z.object({
  errors: z.array(z.string()),
  message: z.string(),
  status: z.number(),
  statusText: z.string(),
});

export const $fetch = createFetch({
  defaultError: fetchErrorSchema,
});

export type FetchErrorResponse = z.infer<typeof fetchErrorSchema>;
