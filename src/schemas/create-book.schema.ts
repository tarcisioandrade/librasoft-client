import { z } from "zod";

export const createBookFormSchema = z.object({
  title: z.string(),
  image: z.string(),
  isbn: z.string().length(10, "Um número de ISBN deve conter 10 dígitos."),
  language: z.string(),
  coverType: z.string(),
  copiesAvailable: z
    .string()
    .min(1)
    .refine((data) => Number.isInteger(Number(data)), { message: "Digite um número inteiro." }),
  publisher: z.string(),
  publicationAt: z
    .string()
    .refine((data) => new Date().getTime() > new Date(data).getTime(), {
      message: "Data inválida.",
    })
    .transform((data) => new Date(data).toISOString()),
  sinopse: z.string().min(120),
  width: z
    .string()
    .transform((arg) => arg.replace(",", "."))
    .refine((data) => parseFloat(data) >= 1, { message: "Deve ser maior ou igual a 1." }),
  height: z
    .string()
    .transform((arg) => arg.replace(",", "."))
    .refine((data) => parseFloat(data) >= 1, { message: "Deve ser maior ou igual a 1." }),
  depth: z
    .string()
    .transform((arg) => arg.replace(",", "."))
    .refine((data) => parseFloat(data) >= 1, { message: "Deve ser maior ou igual a 1." }),
  pageCount: z
    .string()
    .min(1)
    .refine((data) => Number.isInteger(Number(data)), { message: "Digite um número inteiro." }),
});

export type CreateBookFormType = z.input<typeof createBookFormSchema>;

export const createBookInputSchema = createBookFormSchema
  .omit({ width: true, height: true, depth: true })
  .merge(
    z.object({
      categories: z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
        }),
      ),
      copiesAvailable: z.number(),
      authorId: z.string(),
      dimensions: z.object({
        width: z.number(),
        height: z.number(),
        depth: z.number(),
      }),
      pageCount: z.number(),
    }),
  );

export type CreateBookInputType = z.infer<typeof createBookInputSchema>;
