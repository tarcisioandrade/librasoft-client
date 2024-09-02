import { $fetch } from "@/lib/fetch-base";
import { viaCepResponseSchema } from "@/schemas/via-cep.schema";

export class ViaCepService {
  private baseURl = "https://viacep.com.br";

  private ComposeUrl(cep: string) {
    return this.baseURl + `/ws/${cep}/json/`;
  }

  public async Get(cep: string) {
    const { data } = await $fetch(this.ComposeUrl(cep), {
      output: viaCepResponseSchema,
    });
    return data;
  }
}
