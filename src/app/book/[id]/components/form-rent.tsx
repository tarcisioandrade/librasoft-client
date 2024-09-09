import { Book } from "@/types/Book";
import React from "react";
import SheetBagAndButton from "./sheet-bag-and-button";
import { BagService } from "@/services/bag.service";
import { RentService } from "@/services/rent.service";
import { getSession } from "@/services/session";
import { Response } from "@/types/Response";
import { Rent } from "@/types/Rent";
import { Bag } from "@/types/Bag";

type Props = {
  book: Book;
};

const bagService = new BagService();
const rentsService = new RentService();

const FormRent = async ({ book }: Props) => {
  const session = await getSession();
  let bags: Response<Bag[]> | null = null;
  let rents: Response<Rent[]> | null = null;
  if (session) {
    bags = await bagService.GetAll();
    rents = await rentsService.GetAllOfUser("pending");
  }
  let booksRented = rents ? rents.data.reduce((acc, rent) => acc + rent.books.length, 0) : 0;

  return (
    <>
      <input hidden name="bookId" defaultValue={book.id} />
      <SheetBagAndButton
        bags={bags?.data ?? []}
        disabled={book.copiesAvaliable <= 0}
        rentsCount={booksRented}
        session={session?.user}
      />
    </>
  );
};

export default FormRent;
