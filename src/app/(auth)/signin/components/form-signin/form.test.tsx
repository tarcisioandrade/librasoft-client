import { fireEvent, render, waitFor } from "@testing-library/react";
import { IFormSigninService, SigninActionProps } from "./form.type";
import { useFormSigninModel } from "./form.model";
import { Err } from "@/utils/result";
import { changeInput } from "@/tests/change-input";
import FormSignin from "./form-signin.view";
import { vi } from "vitest";

const MockServiceFailure: IFormSigninService = {
  signIn: vi.fn().mockResolvedValue(Err({ message: ["ERROR"] })),
};

function MakeSuit({ services = MockServiceFailure }: { services?: IFormSigninService }) {
  const methods = useFormSigninModel(services);
  return <FormSignin {...methods} />;
}

describe("<FormSignin />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should display messages after invalid password and email submission", async () => {
    const screen = render(<MakeSuit />);
    const button = screen.getByTestId("button-test");
    const inputEmail = screen.container.querySelector("#email") as HTMLInputElement;
    const passwordEmail = screen.container.querySelector("#password") as HTMLInputElement;

    changeInput({ input: inputEmail, valueInput: "email@gmail" });
    changeInput({ input: passwordEmail, valueInput: "1234" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryAllByTestId("error-message").length).toBe(2);
    });
  });

  test("should not display any error message after subimission with the correct values", async () => {
    const screen = render(<MakeSuit />);
    const button = screen.getByTestId("button-test");
    const inputEmail = screen.container.querySelector("#email") as HTMLInputElement;
    const passwordEmail = screen.container.querySelector("#password") as HTMLInputElement;

    const input: SigninActionProps = {
      email: "email@gmail.com",
      password: "123456789b",
      callbackUrl: "/",
    };

    changeInput({ input: inputEmail, valueInput: input.email });
    changeInput({ input: passwordEmail, valueInput: input.password });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryAllByTestId("error-message").length).toBe(0);
      expect(MockServiceFailure.signIn).toHaveBeenCalledWith(input);
    });
  });
});
