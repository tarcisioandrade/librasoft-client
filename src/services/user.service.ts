import { CacheKeys } from "@/cache-keys";
import { ChangePasswordInput } from "@/schemas/change-password.schema";
import { UserUpdate } from "@/schemas/user.schema";
import { Punishment } from "@/types/Punishment";
import { Response } from "@/types/Response";
import { User } from "@/types/User";
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

  async GetAllPunishments() {
    const { data } = await fetchWithCredentials<Response<Punishment[]>>(
      this.endpoint + "/punishments",
      {
        cache: "force-cache",
        next: {
          tags: [CacheKeys.Punishment.GetAll],
        },
      },
    );
    return data;
  }
}
