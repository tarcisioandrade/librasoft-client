import { Book } from "@/types/Book";
import React from "react";
import { BagService } from "@/services/bag.service";
import { RentService } from "@/services/rent.service";
import { getSession } from "@/services/session.service";
import { Response } from "@/types/Response";
import { Rent } from "@/types/Rent";
import { Bag } from "@/types/Bag";
import SheetBagAndButtonWrapper from "./sheet-bag-and-button";

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
      <SheetBagAndButtonWrapper
        bags={bags?.data || []}
        rentsCount={booksRented}
        session={session?.user}
      />
    </>
  );
};

export default FormRent;
