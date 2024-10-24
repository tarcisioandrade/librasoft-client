import { SignupForm } from "@/schemas/session.schema";
import { type Err, type Ok } from "@/utils/result";

export interface IFormSignupService {
  signup: (input: SignupForm) => Promise<Err<{ message: string[][] }> | Ok<null>>;
}
