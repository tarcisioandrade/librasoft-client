import { z } from "zod";

export const reviewSchema = z.object({
  title: z.string().max(90),
  comment: z.string().max(1100),
  bookId: z.string(),
  rating: z.number(),
});

export type ReviewForm = z.infer<typeof reviewSchema>;
