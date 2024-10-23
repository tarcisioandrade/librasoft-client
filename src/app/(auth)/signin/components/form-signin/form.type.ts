import { SigninForm } from "@/schemas/session.schema";
import { type Err, type Ok } from "@/utils/result";

export type SigninActionProps = {
  callbackUrl: string;
} & SigninForm;

export interface IFormSigninService {
  signIn: (input: SigninActionProps) => Promise<Err<{ message: string[] }> | Ok<unknown>>;
}
