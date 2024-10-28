import { $fetch } from "@/lib/fetch-base";
import { AddressInfoSchema } from "@/schemas/address-info.schema";
import { Err, Ok } from "@/utils/result";

export class ViaCepService {
  private baseURl = "https://viacep.com.br";

  private ComposeUrl(cep: string) {
    return this.baseURl + `/ws/${cep}/json/`;
  }

  public async Get(cep: string) {
    const { data } = await $fetch(this.ComposeUrl(cep));
    const parsed = await AddressInfoSchema.safeParseAsync(data);

    if (parsed.success) return Ok(parsed.data);

    return Err({
      message: "Não encontramos nenhum resultado, verifique seu cep e tente novamente.",
    });
  }
}
