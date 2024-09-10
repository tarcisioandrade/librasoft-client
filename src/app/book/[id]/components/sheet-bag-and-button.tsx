"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import React, { useOptimistic, useState, useTransition } from "react";
import { Bag } from "@/types/Bag";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ECoverType } from "@/enums/ECoverType";
import StarRating from "@/components/star-rating";
import { createBagAction } from "@/actions/bag/create.action";
import { useParams, usePathname, useRouter } from "next/navigation";
import { deleteBagAction } from "@/actions/bag/delete.action";
import { Constants } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SheetBagSkeleton from "./sheet-bag-skeleton";
import { User } from "@/types/User";

type Props = ButtonProps & {
  bags: Bag[];
  rentsCount: number;
  session?: User;
};

const SheetBagAndButton = ({ bags, rentsCount, session, ...props }: Props) => {
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
      await createBagAction(CURRENT_BOOK_ID);
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
    deleteBagAction(bagId);
  };

  const DefaultSheetDescription = () => (
    <SheetDescription>
      Você pode ter no máximo {Constants.BOOK_RENT_MAX_LIMIT} livros alugados simultanêamente.
    </SheetDescription>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheet}>
        <SheetTrigger asChild>
          <Button className="w-full" type="submit" {...props}>
            Alugar
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Sua Sacola</SheetTitle>
            {!HAS_RENT_IN_PROGRESS && !RENTS_REACHED_LIMIT ? <DefaultSheetDescription /> : null}

            {HAS_RENT_IN_PROGRESS ? (
              <SheetDescription className="text-yellow-600">
                Você ja tem {rentsCount} livro(s) com aluguel em andamento. Você pode alugar só mais{" "}
                {BOOK_SELECTED_LIMIT} livro(s).
              </SheetDescription>
            ) : null}

            {RENTS_REACHED_LIMIT ? (
              <SheetDescription className="text-red-500">
                Você já alcançou o limite máximo de {Constants.BOOK_RENT_MAX_LIMIT} livros em
                alguel. Faça a devolução para fazer outro pedido.
              </SheetDescription>
            ) : null}
          </SheetHeader>

          <div className="h-full overflow-y-auto pb-8">
            {optismisticBags.map((bag, i, array) => (
              <div key={bag.id} className={cn("py-6", array.length !== i + 1 && "border-b")}>
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
                  <div className="flex flex-col justify-between">
                    <div className="space-y-1">
                      <Link href={`/book/${bag.book.id}`}>
                        <strong className="block w-[320px] truncate font-semibold">
                          {bag.book.title}
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
                    </div>
                    <form action={deleteBag(bag.id)}>
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
            {isLoading ? <SheetBagSkeleton /> : null}
          </div>
          <Button onClick={() => router.push("/bag")}>Fazer Pedido</Button>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetBagAndButton;
