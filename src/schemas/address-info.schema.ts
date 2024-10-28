import { z } from "zod";

export const AddressInfoSchema = z.object({
  logradouro: z.string(),
  localidade: z.string(),
  bairro: z.string(),
  estado: z.string(),
  // cep: z.string(),
  // complemento: z.string(),
  // unidade: z.string(),
  // uf: z.string(),
  // regiao: z.string(),
  // ibge: z.string(),
  // gia: z.string(),
  // ddd: z.string(),
  // siafi: z.string(),
});

export type AddressInfo = z.infer<typeof AddressInfoSchema>;
