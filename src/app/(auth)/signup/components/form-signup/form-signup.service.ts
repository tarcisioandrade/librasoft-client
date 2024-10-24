import { signupAction } from "@/actions/auth/signup.action";
import { IFormSignupService } from "./form-signup.type";
import { SignupForm } from "@/schemas/session.schema";

export class FormSignupActionService implements IFormSignupService {
  async signup(input: SignupForm) {
    return await signupAction(input);
  }
}
