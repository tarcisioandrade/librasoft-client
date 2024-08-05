import { z } from "zod";

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const parsed = z.string().datetime().safeParse(date);
  if (!parsed.success) throw new Error(parsed.error.message);
  return new Date(date).toLocaleDateString("pt-BR", { dateStyle: "long", ...options });
}
