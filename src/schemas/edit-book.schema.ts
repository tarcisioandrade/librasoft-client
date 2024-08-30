import { z } from "zod";
import { createBookFormSchema } from "./create-book.schema";

export const editBookFormSchema = createBookFormSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
);

export type EditBookFormType = z.input<typeof editBookFormSchema>;

export const editBookInputSchema = editBookFormSchema
  .omit({ width: true, height: true, depth: true })
  .merge(
    z.object({
      categories: z.array(
        z.object({
          title: z.string(),
        }),
      ),
      copiesAvailable: z.number(),
      author: z.object({
        name: z.string(),
      }),
      dimensions: z.object({
        width: z.number(),
        height: z.number(),
        depth: z.number(),
      }),
      pageCount: z.number(),
    }),
  );

export type EditBookInputType = z.infer<typeof editBookInputSchema>;
