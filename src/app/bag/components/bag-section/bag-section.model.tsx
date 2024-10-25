import { useRouter } from "next/navigation";
import { IBagSectionService, IBagSectionSummary } from "./bag-section.type";
import { useOptimistic, useState, useTransition } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { Constants } from "@/constants";

type BookAndBagId = {
  bookId: string;
  bagId: string;
};

export function useBagSectionModel(service: IBagSectionService, summary: IBagSectionSummary) {
  const { bags, selectedLimit, user } = summary;

  const [booksAndBagsIdSelected, setBooksAndBagsIdSelected] = useState<BookAndBagId[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [optismisticBags, removeOptimisticBags] = useOptimistic(bags, (state, bagId: string) => {
    return state?.filter((bag) => bag.id !== bagId) ?? null;
  });
  const router = useRouter();

  function isChecked(bookId: string) {
    return booksAndBagsIdSelected.some((item) => item.bookId === bookId);
  }

  function isDisabled(bookId: string) {
    return (
      booksAndBagsIdSelected.length === selectedLimit &&
      !booksAndBagsIdSelected.find((book) => book.bookId === bookId)
    );
  }

  function handleBooksAndBagsIdSelected(checked: CheckedState, input: BookAndBagId) {
    if (isDisabled(input.bookId)) return;

    setBooksAndBagsIdSelected((state) => {
      let currentIdBooks = state;
      currentIdBooks = checked
        ? [...currentIdBooks, input]
        : currentIdBooks.filter((id) => id.bookId !== input.bookId);
      return currentIdBooks;
    });
  }

  async function createRent(_: FormData) {
    if (user.status !== "Active" || !user.address) return;
    startTransition(async () => {
      const books = booksAndBagsIdSelected.map((id) => ({
        id: id.bookId,
      }));
      const response = await service.createRent(books);
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      const bags = booksAndBagsIdSelected.map((id) => ({
        id: id.bagId,
      }));
      for (let bag of bags) {
        await service.deleteBag(bag.id);
      }
      router.push("/rent");
    });
  }

  const deleteBag = (bagId: string) => async () => {
    removeOptimisticBags(bagId);
    await service.deleteBag(bagId);
  };

  function calculateReturnDate(returnDate: Date) {
    let daysAdded = 0;

    while (daysAdded < Constants.AMOUNT_DAY_TO_RETURN_BOOK) {
      const numberReferenceASaturday = 5;
      const numberReferenceAMonday = 6;

      returnDate.setDate(returnDate.getDate() + 1);

      if (
        returnDate.getDay() !== numberReferenceASaturday &&
        returnDate.getDay() !== numberReferenceAMonday
      ) {
        daysAdded++;
      }
    }
    return returnDate;
  }

  const BUTTON_DISABLED =
    !user.address || !booksAndBagsIdSelected.length || user.status !== "Active" || isLoading;

  return {
    optismisticBags,
    isLoading,
    BUTTON_DISABLED,
    router,
    booksAndBagsIdSelected,
    isChecked,
    isDisabled,
    deleteBag,
    calculateReturnDate,
    createRent,
    handleBooksAndBagsIdSelected,
  };
}
