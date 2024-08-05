import { EUserRole } from "@/enums/EUserRole";
import { EUserStatus } from "@/enums/EUserStatus";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  telephone: z.string(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: z.string(),
    })
    .nullish(),
  role: z.nativeEnum(EUserRole),
  status: z.nativeEnum(EUserStatus),
});

export type User = z.infer<typeof userSchema>;
