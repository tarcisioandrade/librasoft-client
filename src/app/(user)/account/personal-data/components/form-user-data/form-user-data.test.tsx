import { vi } from "vitest";
import { IFormUserDataService, IFormUserDataSummary } from "./form-user-data.type";
import { useFormUserDataModel } from "./form-user-data.model";
import { MockUser } from "@/tests/mock-values";
import FormUserData from "./form-user-data.view";
import { act, fireEvent, render } from "@testing-library/react";
import { changeInput } from "@/tests/change-input";
import { AddressInfo } from "@/schemas/address-info.schema";
import { UserUpdate } from "@/schemas/user.schema";
import { Ok } from "@/utils/result";

const MockAddressResponse: AddressInfo = {
  bairro: "Bairro",
  estado: "Estado",
  localidade: "Localidade",
  logradouro: "Logradouro",
};

const MockService: IFormUserDataService = {
  update: vi.fn().mockResolvedValue(Ok({ message: "SUCCESS" })),
  getAddressWithCep: vi.fn().mockResolvedValue(Ok(MockAddressResponse)),
};

const MockSummary: IFormUserDataSummary = {
  user: MockUser,
};

function MakeSuit(summary?: Partial<IFormUserDataSummary["user"]>) {
  const methods = useFormUserDataModel(MockService, { user: { ...MockSummary.user, ...summary } });
  return <FormUserData {...methods} />;
}

describe("<FormUserData />", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  test("should display message alerting user to fill in the address information", () => {
    const screen = render(<MakeSuit address={null} />);

    expect(screen.getByTestId("alert-message")).toBeTruthy();
  });

  test("the default value of the inputs must be the same as the user", async () => {
    const screen = render(<MakeSuit />);

    // Wait for the React Hook Form Controller to finish updating.
    await act(async () => await vi.advanceTimersByTimeAsync(1000));

    const inputName = screen.container.querySelector("#name") as HTMLInputElement;
    const inputTelephone = screen.container.querySelector("#telephone") as HTMLInputElement;
    const inputEmail = screen.container.querySelector("#email") as HTMLInputElement;

    expect(inputName.value).toBe(MockSummary.user.name);
    expect(inputTelephone.value).toBe(MockSummary.user.telephone);
    expect(inputEmail.value).toBe(MockSummary.user.email)
  });

  test("should display a error message if cep value not is valid", async () => {
    const screen = render(<MakeSuit address={null} />);
    const inputZipCode = screen.container.querySelector("#zipCode") as HTMLInputElement;

    changeInput({ input: inputZipCode, valueInput: "4280" });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryAllByTestId("error-message").length).toBe(1);
  });

  test("should populate inputs with valid cep value", async () => {
    const screen = render(<MakeSuit address={null} />);
    const inputZipCode = screen.container.querySelector("#zipCode") as HTMLInputElement;
    const inputStreet = screen.container.querySelector("#street") as HTMLInputElement;
    const inputDistrict = screen.container.querySelector("#district") as HTMLInputElement;
    const inputCity = screen.container.querySelector("#city") as HTMLInputElement;
    const inputState = screen.container.querySelector("#state") as HTMLInputElement;

    const zipCode = "01000013";
    changeInput({ input: inputZipCode, valueInput: zipCode });

    await act(async () => await vi.advanceTimersByTimeAsync(1000));

    expect(MockService.getAddressWithCep).toHaveBeenCalledWith(zipCode);
    expect(inputStreet.value).toBe(MockAddressResponse.logradouro);
    expect(inputCity.value).toBe(MockAddressResponse.localidade);
    expect(inputState.value).toBe(MockAddressResponse.estado);
    expect(inputDistrict.value).toBe(MockAddressResponse.bairro);
  });

  test("should submit form if all fields are valid", async () => {
    const screen = render(<MakeSuit address={null} />);
    const inputZipCode = screen.container.querySelector("#zipCode") as HTMLInputElement;
    const submitButton = screen.getByTestId("submit-button");
    const zipCode = "01000013";

    const { role, status, id, ...rest } = MockSummary.user;

    const expectedInput: UserUpdate = {
      ...rest,
      address: {
        zipCode,
        city: MockAddressResponse.localidade,
        street: MockAddressResponse.logradouro,
        state: MockAddressResponse.estado,
        district: MockAddressResponse.bairro,
      },
    };

    changeInput({ input: inputZipCode, valueInput: zipCode });

    await act(async () => await vi.advanceTimersByTimeAsync(1000));
    await act(async () => fireEvent.click(submitButton));

    expect(MockService.update).toHaveBeenCalledWith(expectedInput);
  });
});
