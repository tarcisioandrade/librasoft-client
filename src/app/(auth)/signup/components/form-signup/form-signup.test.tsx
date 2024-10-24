import { vi } from "vitest";
import { IFormSignupService } from "./form-signup.type";
import { Err } from "@/utils/result";
import { useFormSignupModel } from "./form-signup.model";
import FormSignup from "./form-signup.view";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { changeInput } from "@/utils/tests/change-input";
import { SignupForm } from "@/schemas/session.schema";

const MockSignupService: IFormSignupService = {
  signup: vi.fn().mockResolvedValue(Err({ message: ["ERROR"] })),
};

function MakeSuit({ service = MockSignupService }: { service?: IFormSignupService }) {
  const methods = useFormSignupModel(service);
  return <FormSignup {...methods} />;
}

function submitForm(screen: ReturnType<typeof render>) {
  const button = screen.getByTestId("button-submit");
  const inputName = screen.container.querySelector("#name") as HTMLInputElement;
  const inputEmail = screen.container.querySelector("#email") as HTMLInputElement;
  const inputTelephone = screen.container.querySelector("#telephone") as HTMLInputElement;
  const inputPassword = screen.container.querySelector("#password") as HTMLInputElement;

  const user: SignupForm = {
    name: "new user",
    email: "email@gmail.com",
    password: "123456789abc",
    telephone: "71986797777",
  };

  changeInput({ input: inputName, valueInput: user.name });
  changeInput({ input: inputEmail, valueInput: user.email });
  changeInput({ input: inputTelephone, valueInput: user.telephone });
  changeInput({ input: inputPassword, valueInput: user.password });

  fireEvent.click(button);

  return user;
}

describe("<FormSignup />", () => {
  test("should display 4 error messages after subimission with all invalid values", async () => {
    const screen = render(<MakeSuit />);
    const button = screen.getByTestId("button-submit");
    const inputName = screen.container.querySelector("#name") as HTMLInputElement;
    const inputEmail = screen.container.querySelector("#email") as HTMLInputElement;
    const inputTelephone = screen.container.querySelector("#telephone") as HTMLInputElement;
    const inputPassword = screen.container.querySelector("#password") as HTMLInputElement;

    changeInput({ input: inputName, valueInput: "123" });
    changeInput({ input: inputEmail, valueInput: "email@gmail" });
    changeInput({ input: inputTelephone, valueInput: "711234" });
    changeInput({ input: inputPassword, valueInput: "12345632" });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryAllByTestId("error-message").length).toBe(4);
    });
  });

  test("should not display any error message after subimission with all correct values", async () => {
    const screen = render(<MakeSuit />);

    const user = submitForm(screen);

    await waitFor(() => {
      expect(screen.queryAllByTestId("error-message").length).toBe(0);
      expect(MockSignupService.signup).toHaveBeenCalledWith(user);
    });
  });

  test("should disable button while form has submitting", async () => {
    const screen = render(<MakeSuit />);
    const button = screen.getByTestId("button-submit");

    submitForm(screen);

    await waitFor(() => {
      expect(button.hasAttribute("disabled")).toBeTruthy();
    });
  });
});
