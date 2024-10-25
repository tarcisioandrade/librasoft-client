import { vi } from "vitest";
import { ISheetBagAndButtonService, ISheetBagAndButtonSummary } from "./sheet-bag-and-button.types";
import { useSheetBagAndButton } from "./sheet-bag-and-button.model";
import SheetBagAndButton from "./sheet-bag-and-button.view";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockBag } from "@/tests/mock-values";

// Necessary for use values imported from other file in vi.mock. (E.G.: "useParams: vi.fn().mockReturnValue({ id: MockBook.id })").
// Ref: https://bentilling.com/a-practical-guide-to-mocking-svelte-stores-with-vitest
const { MockBook, MockRent, MockUser } = await vi.hoisted(
  async () => await import("@/tests/mock-values"),
);

const mockRouterPush = vi.fn();

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockRouterPush,
    })),
    useParams: vi.fn().mockReturnValue({ id: MockBook.id }),
    usePathname: vi.fn().mockReturnValue("mockPathname"),
  };
});

const MockService: ISheetBagAndButtonService = {
  createBag: vi.fn().mockResolvedValue(true),
  deleteBag: vi.fn().mockResolvedValue(true),
};

interface ISheetBagAndButtonTestSuit {
  summary: ISheetBagAndButtonSummary;
}

function MakeSuit({ summary }: ISheetBagAndButtonTestSuit) {
  const methods = useSheetBagAndButton(MockService, summary);
  return <SheetBagAndButton {...methods} />;
}

let booksRented = [MockRent].reduce((acc, rent) => acc + rent.books.length, 0);

const MockSummary: ISheetBagAndButtonSummary = {
  bags: [],
  rentsCount: booksRented,
  session: MockUser,
};

function clickInRentButton(prop?: Partial<ISheetBagAndButtonTestSuit["summary"]>) {
  const screen = render(<MakeSuit summary={{ ...MockSummary, ...prop }} />);
  const button = screen.getByTestId("rent-button");
  fireEvent.click(button);

  return screen;
}

describe("<SheetAndBagButton />", () => {
  test("should push user to signin route if not authenticate after click in rent button", async () => {
    clickInRentButton({ session: undefined });

    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenCalledWith("/signin?callbackUrl=mockPathname"),
    );
  });

  test("should render a book in bag", async () => {
    const screen = clickInRentButton({ bags: [MockBag] });

    await waitFor(() => {
      const books = screen.getAllByTestId("book-in-bag");
      expect(books.length).toBe(1);
    });
  });

  test("should add a book in bag", async () => {
    clickInRentButton();

    await waitFor(() => {
      expect(MockService.createBag).toHaveBeenCalledWith(MockBook.id);
    });
  });

  test("should remove a book from bag", async () => {
    const screen = clickInRentButton({ bags: [MockBag] });

    await waitFor(() => {
      const removeButton = screen.getByTestId("remove-button");
      fireEvent.click(removeButton);
      expect(MockService.deleteBag).toHaveBeenCalledWith(MockBag.id);
    });

    const books = screen.queryAllByTestId("book-in-bag");
    expect(books.length).toBe(0);
  });

  test("sheet must open after click in rent button.", async () => {
    const screen = clickInRentButton();

    await waitFor(() => expect(screen.getByRole("dialog")).toBeTruthy());
  });

  test("should display default message when no have rent", async () => {
    const screen = clickInRentButton({ rentsCount: 0 });

    await waitFor(() => expect(screen.getByTestId("default-message")).toBeTruthy());
  });

  test("should display message of rents limit reached with 3 book in renting", async () => {
    const screen = clickInRentButton({ rentsCount: 3 });

    await waitFor(() => expect(screen.getByTestId("limit-reached")).toBeTruthy());
  });

  test("should display message of rent in progress with 1 book in renting", async () => {
    const screen = clickInRentButton({ rentsCount: 1 });

    await waitFor(() => expect(screen.getByTestId("in-progress")).toBeTruthy());
  });

  test("should close dialog after click in 'Continuar Alugando' button", async () => {
    const screen = clickInRentButton();

    await waitFor(() => {
      const continueButton = screen.getByTestId("continue-button");
      fireEvent.click(continueButton);
    });

    expect(screen.queryByRole("dialog")).toBeFalsy();
  });

  test("should push to '/bag' route after click in 'Fazer Pedido' button", async () => {
    const screen = clickInRentButton();

    await waitFor(() => {
      const continueButton = screen.getByTestId("request-button");
      fireEvent.click(continueButton);
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/bag");
  });
});
