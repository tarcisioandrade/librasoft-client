import { UserUpdate } from "@/schemas/user.schema";
import { IFormUserDataService } from "./form-user-data.type";
import { updateUserAction } from "@/actions/user/update.action";
import { ViaCepService } from "@/services/via-cep.service";

export class FormUserDataActionService implements IFormUserDataService {
  async update(input: UserUpdate) {
    return await updateUserAction(input);
  }
  async getAddressWithCep(cep: string) {
    const viaCepService = new ViaCepService();
    return await viaCepService.Get(cep);
  }
}
