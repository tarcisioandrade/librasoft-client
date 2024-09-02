import { EUserRole } from "@/enums/EUserRole";
import { EUserStatus } from "@/enums/EUserStatus";
import { z } from "zod";

const TELEPHONE_REGEXP =
  /(\b\(\d{2}\)\s?[9]?\s?\d{4}(\-|\s)?\d\d{4})|(\b\d{2}\s?[9]?\s?\d{4}(\-|\s)?\d{4})|(\b([9]|[9]\s)?\d{4}(\-|\s)?\d{4})|(\b\d{4}(\-|\s)?\d{4})/;

export const zipCodeSchema = z
  .string()
  .max(8)
  .regex(/^\d{2}\d{3}\d{3}$/, "Digite um CEP válido.");

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  telephone: z.string().regex(TELEPHONE_REGEXP, "Digite um número de celular válido."),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: zipCodeSchema,
    })
    .nullish(),
  role: z.nativeEnum(EUserRole),
  status: z.nativeEnum(EUserStatus),
});
export type User = z.infer<typeof userSchema>;
export const userUpdateSchema = userSchema.omit({ role: true, status: true, id: true });
export type UserUpdate = z.infer<typeof userUpdateSchema>;
