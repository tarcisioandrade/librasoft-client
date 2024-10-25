import { Constants } from "@/constants";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useOptimistic, useTransition } from "react";
import { ISheetBagAndButtonService, ISheetBagAndButtonSummary } from "./sheet-bag-and-button.types";

export function useSheetBagAndButton(
  service: ISheetBagAndButtonService,
  summary: ISheetBagAndButtonSummary,
) {
  const { bags, rentsCount, session } = summary;
  const [open, setOpen] = useState(false);
  const [optismisticBags, removeOptimisticBags] = useOptimistic(
    bags,
    (state, bagId: string) => state.filter((bag) => bag.id !== bagId) ?? [],
  );
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, startTransition] = useTransition();

  const CURRENT_BOOK_ID = String(params.id);
  const BOOK_SELECTED_LIMIT = Constants.BOOK_RENT_MAX_LIMIT - rentsCount;
  const RENTS_REACHED_LIMIT = rentsCount >= 3;
  const HAS_RENT_IN_PROGRESS = rentsCount > 0 && rentsCount < 3;

  function createBagFn() {
    startTransition(async () => {
      await service.createBag(CURRENT_BOOK_ID);
    });
  }

  function handleSheet(state: boolean) {
    if (!session) {
      router.push(`/signin?callbackUrl=${pathname}`);
      return;
    }
    setOpen(state);
    const BOOK_ALREADY_IN_BAG = bags.some((b) => b.book.id === params.id);
    if (BOOK_ALREADY_IN_BAG || !state) return;
    createBagFn();
  }

  const deleteBag = (bagId: string) => async () => {
    removeOptimisticBags(bagId);
    service.deleteBag(bagId);
  };

  return {
    setOpen,
    open,
    optismisticBags,
    handleSheet,
    deleteBag,
    BOOK_SELECTED_LIMIT,
    RENTS_REACHED_LIMIT,
    HAS_RENT_IN_PROGRESS,
    isLoading,
    rentsCount,
    router,
  };
}
