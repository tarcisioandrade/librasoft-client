import { z } from "zod";

export const STATUS_FILTER_OPTIONS = ["inactive", "active"] as const;

export const filterParamsSchema = z.object({
  pageNumber: z.string().default("1"),
  pageSize: z.string().default("10"),
  title: z.string().optional(),
  categories: z.string().optional(),
  status: z.enum(STATUS_FILTER_OPTIONS).optional(),
});

export type FilterParams = z.output<typeof filterParamsSchema>;
