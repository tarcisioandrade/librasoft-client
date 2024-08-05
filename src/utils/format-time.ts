import { z } from "zod";

export function formatTime(date: string, options?: Intl.DateTimeFormatOptions) {
  const parsed = z.string().datetime().safeParse(date);
  if (!parsed.success) throw new Error(parsed.error.message);
  return new Date(date).toLocaleTimeString("pt-BR", { ...options });
}
