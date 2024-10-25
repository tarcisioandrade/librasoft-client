import { Button, ButtonProps } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ECoverType } from "@/enums/ECoverType";
import StarRating from "@/components/star-rating";
import { Constants } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SheetBagSkeleton from "../sheet-bag-skeleton";
import { useSheetBagAndButton } from "./sheet-bag-and-button.model";

type Props = ButtonProps & ReturnType<typeof useSheetBagAndButton>;

const SheetBagAndButton = (props: Props) => {
  const {
    BOOK_SELECTED_LIMIT,
    HAS_RENT_IN_PROGRESS,
    RENTS_REACHED_LIMIT,
    deleteBag,
    handleSheet,
    isLoading,
    open,
    optismisticBags,
    rentsCount,
    router,
    setOpen,
    ...properties
  } = props;

  const DefaultSheetDescription = () => (
    <SheetDescription data-testid="default-message">
      Você pode ter no máximo {Constants.BOOK_RENT_MAX_LIMIT} livros alugados simultanêamente.
    </SheetDescription>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheet}>
        <SheetTrigger asChild>
          <Button className="w-full" type="submit" data-testid="rent-button" {...properties}>
            Alugar
          </Button>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Sua Sacola</SheetTitle>
            {!HAS_RENT_IN_PROGRESS && !RENTS_REACHED_LIMIT ? <DefaultSheetDescription /> : null}

            {HAS_RENT_IN_PROGRESS ? (
              <SheetDescription className="text-yellow-600" data-testid="in-progress">
                Você ja tem {rentsCount} livro(s) com aluguel em andamento. Você pode alugar só mais{" "}
                {BOOK_SELECTED_LIMIT} livro(s).
              </SheetDescription>
            ) : null}

            {RENTS_REACHED_LIMIT ? (
              <SheetDescription className="text-red-500" data-testid="limit-reached">
                Você já alcançou o limite máximo de {Constants.BOOK_RENT_MAX_LIMIT} livros em
                alguel. Faça a devolução para fazer outro pedido.
              </SheetDescription>
            ) : null}
          </SheetHeader>

          <div className="h-full overflow-y-auto pb-8">
            {optismisticBags.map((bag, i, array) => (
              <div
                key={bag.id}
                className={cn("py-6", array.length !== i + 1 && "border-b")}
                data-testid="book-in-bag"
              >
                <div className="flex gap-6">
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
                        <strong className="line-clamp-2 text-sm font-semibold lg:text-base">
                          {bag.book.title}
                        </strong>
                      </Link>
                      <p className="text-sm">por {bag.book.authorName}</p>
                      <StarRating size={12} rating={bag.book.averageRating} />
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
                      <Button
                        variant="link"
                        className="h-fit w-fit p-0 text-xs text-muted-foreground"
                        data-testid="remove-button"
                      >
                        Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {isLoading ? <SheetBagSkeleton /> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/bag")} data-testid="request-button">
              Fazer Pedido
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              data-testid="continue-button"
            >
              Continuar Alugando
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetBagAndButton;
