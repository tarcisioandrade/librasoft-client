import { IFormSigninService, SigninActionProps } from "./form.type";
import { signinAction } from "@/actions/auth/signin.action";

export class FormActionService implements IFormSigninService {
  async signIn(input: SigninActionProps) {
    return await signinAction(input);
  }
}
