import { AddressInfo } from "@/schemas/address-info.schema";
import { UserUpdate } from "@/schemas/user.schema";
import { User } from "@/types/User";
import { Err, Ok } from "@/utils/result";

export interface IFormUserDataService {
  update: (
    input: UserUpdate,
  ) => Promise<Err<{ message: string[] }> | Ok<{ message: string; user: User }>>;
  getAddressWithCep: (cep: string) => Promise<Ok<AddressInfo> | Err<{ message: string }>>;
}

export interface IFormUserDataSummary {
  user: User;
}
