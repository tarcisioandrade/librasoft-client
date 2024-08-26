import { z } from "zod";

export const STATUS_FILTER_OPTIONS = ["inactive", "active"] as const;
const RENT_FILTER_OPTIONS = [
  "Rent_Canceled",
  "Rent_Expired",
  "Rent_Finished",
  "Rent_In_Progress",
  "Requested_Awaiting_Pickup",
] as const;

const defaultPaginationSchema = z.object({
  pageNumber: z.string().default("1"),
  pageSize: z.string().default("10"),
});

export const filterBooksParamsSchema = defaultPaginationSchema.merge(
  z.object({
    title: z.string().optional(),
    categories: z.string().optional(),
    status: z.enum(STATUS_FILTER_OPTIONS).optional(),
  }),
);

export type FilterBooksParams = z.output<typeof filterBooksParamsSchema>;

export const filterRentsParamsSchema = defaultPaginationSchema.merge(
  z.object({
    user_email: z.string().optional(),
    status: z.enum(RENT_FILTER_OPTIONS).optional(),
  }),
);

export type FilterRentsParams = z.output<typeof filterRentsParamsSchema>;
