"use client";

import { deleteBagAction } from "@/actions/bag/delete.action";
import { createRentAction } from "@/actions/rent/create.action";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Constants } from "@/constants";
import { ECoverType } from "@/enums/ECoverType";
import { cn } from "@/lib/utils";
import { Bag } from "@/types/Bag";
import { User } from "@/types/User";
import { CheckedState } from "@radix-ui/react-checkbox";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  bags: Bag[] | null;
  selectedLimit: number;
  user: User;
};

type BookAndBagId = {
  bookId: string;
  bagId: string;
};

const BagSection = ({ bags, selectedLimit, user }: Props) => {
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
      const response = await createRentAction(books);
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      const bags = booksAndBagsIdSelected.map((id) => ({
        id: id.bagId,
      }));
      for (let bag of bags) {
        await deleteBagAction(bag.id);
      }
      router.push("/rent");
    });
  }

  const deleteBag = (bagId: string) => async () => {
    removeOptimisticBags(bagId);
    await deleteBagAction(bagId);
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

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {!optismisticBags?.length ? (
          <div className="grid place-items-center border">
            <p className="text-7xl uppercase text-muted-foreground/50">Vazio</p>
          </div>
        ) : (
          <div className="flex flex-col border">
            {optismisticBags?.map((bag, i, array) => (
              <div key={bag.id} className={cn("p-4", array.length !== i + 1 && "border-b")}>
                <div className="relative flex gap-6">
                  <Checkbox
                    name={`book-${bag.book.id}`}
                    checked={isChecked(bag.book.id)}
                    disabled={isDisabled(bag.book.id)}
                    aria-disabled={isDisabled(bag.book.id)}
                    onCheckedChange={(checked) =>
                      handleBooksAndBagsIdSelected(checked, { bookId: bag.book.id, bagId: bag.id })
                    }
                    className="absolute -left-4 self-center lg:static"
                  />
                  <Link href={`/book/${bag.book.id}`} className="h-[150px] w-[110px]">
                    <Image
                      src={bag.book.image}
                      alt={bag.book.title}
                      width={440}
                      height={480}
                      className="h-full"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-1">
                      <Link href={`/book/${bag.book.id}`}>
                        <strong className="line-clamp-3 text-sm font-semibold lg:line-clamp-none lg:text-base">
                          {bag.book.title} -{" "}
                          <span className="font-normal text-muted-foreground">
                            {bag.book.publisher}
                          </span>
                        </strong>
                      </Link>
                      <p className="text-sm lg:block">por Trancador de ruas</p>
                      <StarRating
                        size={12}
                        rating={bag.book.averageRating}
                        className="hidden lg:block"
                      />
                      <p className="text-xs text-muted-foreground">
                        {ECoverType[bag.book.coverType]}
                      </p>
                      {bag.book.copiesAvaliable > 0 ? (
                        <p className="text-xs text-green-700">Disponivel</p>
                      ) : (
                        <p className="text-xs text-red-700">Indisponivel</p>
                      )}
                    </div>
                    <form action={deleteBag(bag.id)}>
                      <input hidden name="bagId" defaultValue={bag.id} />
                      <Button
                        variant="link"
                        className="h-fit w-fit p-0 text-xs text-muted-foreground"
                      >
                        Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex h-[370px] flex-col justify-between border p-4">
          <div className="space-y-4">
            <p>
              Subtotal: <strong>{booksAndBagsIdSelected.length} Livro(s)</strong>
            </p>
            <p>
              Data de Devolução:{" "}
              <strong>
                {calculateReturnDate(new Date()).toLocaleDateString("pt-BR", {
                  dateStyle: "long",
                })}
              </strong>
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Sujeito a penalidades em caso de atraso.</p>
              <p>48 horas para a retirada do livro ou o pedido é cancelado automaticamente.</p>
            </div>
          </div>
          <form action={createRent}>
            <Button className="w-full" disabled={BUTTON_DISABLED} aria-disabled={BUTTON_DISABLED}>
              {isLoading ? "Fechando..." : "Fechar Pedido"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BagSection;
