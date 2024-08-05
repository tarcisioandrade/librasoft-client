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
import { CheckedState } from "@radix-ui/react-checkbox";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  bags: Bag[] | null;
  booksRented: number;
};

type BookAndBagId = {
  bookId: string;
  bagId: string;
};

const BagSection = ({ bags, booksRented }: Props) => {
  const [booksAndBagsIdSelected, setBooksAndBagsIdSelected] = useState<BookAndBagId[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [optismisticBags, removeOptimisticBags] = useOptimistic(bags, (state, bookId: string) => {
    return state?.filter((bag) => bag.id !== bookId) ?? null;
  });
  const router = useRouter();

  const BOOK_RENT_MAX_LIMIT = 3;
  const BOOK_SELECTED_LIMIT = BOOK_RENT_MAX_LIMIT - booksRented;

  function isChecked(bookId: string) {
    return booksAndBagsIdSelected.some((item) => item.bookId === bookId);
  }

  function isDisabled(bookId: string) {
    return (
      booksAndBagsIdSelected.length === BOOK_SELECTED_LIMIT &&
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
    startTransition(async () => {
      const formDataBooks = new FormData();
      const books = booksAndBagsIdSelected.map((id) => ({
        id: id.bookId,
      }));
      formDataBooks.append("books", JSON.stringify(books));
      const response = await createRentAction(formDataBooks);
      if (!response.success) {
        toast.error(response.error?.message);
        return;
      }
      const bags = booksAndBagsIdSelected.map((id) => ({
        id: id.bagId,
      }));
      for (let bag of bags) {
        const formDataBags = new FormData();
        formDataBags.append("bagId", bag.id);
        await deleteBagAction(formDataBags);
      }
      router.push("/rent");
    });
  }

  const deleteBag = (bagId: string) => async (formData: FormData) => {
    removeOptimisticBags(bagId);
    await deleteBagAction(formData);
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

  return (
    <>
      {booksRented > 0 && booksRented < 3 ? (
        <div className="mb-2 bg-yellow-200 p-2">
          <p className="text-sm text-green-800">
            Você ja tem {booksRented} livro(s) com aluguel em andamento. Você pode alugar só mais{" "}
            {BOOK_SELECTED_LIMIT} livro(s).
          </p>
        </div>
      ) : null}

      {booksRented >= 3 ? (
        <div className="mb-2 bg-yellow-200 p-2">
          <p className="text-sm text-green-800">
            Você já alcançou o limite máximo de livros ({BOOK_RENT_MAX_LIMIT}) em alguel. Faça a
            devolução para poder efetuar outro aluguél.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_400px] gap-4">
        {!optismisticBags?.length ? (
          <div className="grid place-items-center border">
            <p className="text-7xl uppercase text-muted-foreground/50">Vazio</p>
          </div>
        ) : (
          <div className="flex flex-col border">
            {optismisticBags?.map((bag, i, array) => (
              <div key={bag.id} className={cn("p-4", array.length !== i + 1 && "border-b")}>
                <div className="flex items-center gap-6">
                  <Checkbox
                    name={`book-${bag.book.id}`}
                    checked={isChecked(bag.book.id)}
                    disabled={isDisabled(bag.book.id)}
                    aria-disabled={isDisabled(bag.book.id)}
                    onCheckedChange={(checked) =>
                      handleBooksAndBagsIdSelected(checked, { bookId: bag.book.id, bagId: bag.id })
                    }
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
                  <div className="space-y-1">
                    <Link href={`/book/${bag.book.id}`}>
                      <strong className="font-semibold">
                        {bag.book.title} -{" "}
                        <span className="font-normal text-muted-foreground">
                          {bag.book.publisher}
                        </span>
                      </strong>
                    </Link>
                    <p className="text-sm">por Trancador de ruas</p>
                    <StarRating size={12} rating={bag.book.averageRating} />
                    <p className="text-xs text-muted-foreground">
                      {ECoverType[bag.book.coverType]}
                    </p>
                    {bag.book.copiesAvaliable > 0 ? (
                      <p className="text-xs text-green-700">Disponivel</p>
                    ) : (
                      <p className="text-xs text-red-700">Indisponivel</p>
                    )}
                    <form action={deleteBag(bag.id)}>
                      <input hidden name="bagId" defaultValue={bag.id} />
                      <Button variant="link" className="pl-0 text-xs text-muted-foreground">
                        Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4 border p-4">
          <p>
            Subtotal: <strong>{booksAndBagsIdSelected.length} Livros</strong>
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
          <form action={createRent}>
            <Button
              className="w-full"
              disabled={!booksAndBagsIdSelected.length || isLoading}
              aria-disabled={!booksAndBagsIdSelected.length || isLoading}
            >
              {isLoading ? "Fechando..." : "Fechar Pedido"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BagSection;
