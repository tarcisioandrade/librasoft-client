import { ChangePasswordInput } from "@/schemas/change-password.schema";
import { User, UserUpdate } from "@/schemas/user.schema";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { Err, Ok } from "@/utils/result";

export class UserService {
  private endpoint = `/user`;

  async Update(input: UserUpdate) {
    const { data, error } = await fetchWithCredentials<User>(this.endpoint, {
      method: "PATCH",
      body: input,
    });
    if (error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: "Usuário atualizado!", user: data! });
  }

  async ChangePassword(input: ChangePasswordInput) {
    const { error } = await fetchWithCredentials(this.endpoint + "/change-password", {
      method: "PATCH",
      body: input,
    });
    if (error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: "Sua senha foi atualizada com sucesso!" });
  }
}
