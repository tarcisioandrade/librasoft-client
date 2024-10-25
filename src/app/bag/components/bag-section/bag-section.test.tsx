import { vi } from "vitest";
import { IBagSectionService, IBagSectionSummary } from "./bag-section.type";
import { useBagSectionModel } from "./bag-section.model";
import { Constants } from "@/constants";
import { MockBag, MockRent, MockUser } from "@/tests/mock-values";
import { fireEvent, render, waitFor } from "@testing-library/react";
import BagSection from "./bag-section.view";
import { Ok } from "@/utils/result";
import { Bag } from "@/types/Bag";

const MockService: IBagSectionService = {
  createRent: vi.fn().mockResolvedValue(Ok(null)),
  deleteBag: vi.fn(),
};

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  };
});

let booksRented = [MockRent].reduce((acc, rent) => acc + rent.books.length, 0);

const MockSummary: IBagSectionSummary = {
  bags: [MockBag],
  selectedLimit: Constants.BOOK_RENT_MAX_LIMIT - booksRented,
  user: MockUser,
};

function MakeSuit(summary: Partial<IBagSectionSummary>) {
  const methods = useBagSectionModel(MockService, { ...MockSummary, ...summary });
  return <BagSection {...methods} />;
}

describe("<BagSection />", () => {
  test("should render a bag item", async () => {
    const screen = render(<MakeSuit />);

    expect(screen.getAllByTestId("bag-item").length).toBe(1);
  });

  test("should display empty component if don't have item in bag", () => {
    const screen = render(<MakeSuit bags={null} />);
    expect(screen.getByTestId("bag-empty")).toBeTruthy();
  });

  test("should remove a item after click in remove button", async () => {
    const screen = render(<MakeSuit />);
    expect(screen.getAllByTestId("bag-item").length).toBe(1);

    await waitFor(() => {
      const removeButton = screen.getByTestId("remove-button");
      fireEvent.click(removeButton);
    });

    expect(screen.queryAllByTestId("bag-item").length).toBe(0);
    expect(MockService.deleteBag).toHaveBeenCalledWith(MockBag.id);
  });

  test("submit button must be disabled if no items are selected", () => {
    const screen = render(<MakeSuit />);
    const submitButton = screen.getByTestId("submit-button");

    expect(submitButton.hasAttribute("disabled")).toBeTruthy();
  });

  test("submit button must be active if a item are selected", async () => {
    const screen = render(<MakeSuit />);
    const checkbox = screen.getByTestId(`checkbox-${MockBag.book.id}`);

    fireEvent.click(checkbox);

    expect(checkbox.getAttribute("data-state")).toBe("checked");
    expect(screen.getByTestId("submit-button").hasAttribute("disabled")).toBeFalsy();
  });

  test("the subtotal count should be same amount of items selected", async () => {
    const screen = render(<MakeSuit />);
    const checkbox = screen.getByTestId(`checkbox-${MockBag.book.id}`);

    const subtotalCount = screen.getByTestId("subtotal-count");
    expect(subtotalCount.textContent).toMatch(/0 Livro/);

    fireEvent.click(checkbox);

    expect(subtotalCount.textContent).toMatch(/1 Livro/);
  });

  test("should create a rent and delete the bag item after click in submit-button", async () => {
    const screen = render(<MakeSuit />);

    const checkbox = screen.getByTestId(`checkbox-${MockBag.book.id}`);
    fireEvent.click(checkbox);

    await waitFor(() => {
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);
    });

    expect(MockService.createRent).toHaveBeenCalledWith([{ id: MockBag.book.id }]);
    expect(MockService.deleteBag).toHaveBeenCalledWith(MockBag.id);
  });

  test("the send button should be disabled even if there are items selected if the user's status is different from active", async () => {
    const screen = render(<MakeSuit user={{ ...MockUser, status: "Banned" }} />);
    const checkbox = screen.getByTestId(`checkbox-${MockBag.book.id}`);

    fireEvent.click(checkbox);

    expect(checkbox.getAttribute("data-state")).toBe("checked");
    expect(screen.getByTestId("submit-button").hasAttribute("disabled")).toBeTruthy();
  });

  test("the send button must be deactivated even if there are selected items if the user has no registered address", async () => {
    const screen = render(<MakeSuit user={{ ...MockUser, address: null }} />);
    const checkbox = screen.getByTestId(`checkbox-${MockBag.book.id}`);

    fireEvent.click(checkbox);

    expect(checkbox.getAttribute("data-state")).toBe("checked");
    expect(screen.getByTestId("submit-button").hasAttribute("disabled")).toBeTruthy();
  });

  test("the checkboxs must be desatived if overtake the limit max of rents", async () => {
    const bagsWithFourItems: Bag[] = [
      MockBag,
      { ...MockBag, id: "02", book: { ...MockBag.book, id: "02" } },
      { ...MockBag, id: "03", book: { ...MockBag.book, id: "03" } },
      { ...MockBag, id: "04", book: { ...MockBag.book, id: "04" } },
    ];
    const screen = render(<MakeSuit bags={bagsWithFourItems} selectedLimit={3} />);

    for (let i = 0; i < bagsWithFourItems.length; i++) {
      const checkbox = screen.getByTestId(`checkbox-${bagsWithFourItems[i].book.id}`);
      const LAST_ITEM = i === 3;

      fireEvent.click(checkbox);

      if (LAST_ITEM) {
        expect(checkbox.hasAttribute("disabled")).toBeTruthy();
      } else {
        expect(checkbox.getAttribute("data-state")).toBe("checked");
      }
    }
  });
});
