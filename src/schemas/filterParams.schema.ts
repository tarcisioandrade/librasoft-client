import { z } from "zod";

export const filterParamsSchema = z.object({
  pageNumber: z.coerce
    .number()
    .default(1)
    .transform((arg) => arg.toString()),
  pageSize: z.coerce
    .number()
    .default(10)
    .transform((arg) => arg.toString()),
  title: z.string().optional(),
  categories: z.string().optional(),
  includeInactive: z.string().optional(),
});

export type FilterParams = z.output<typeof filterParamsSchema>;
