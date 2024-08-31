import { Book } from "@/types/Book";
import React from "react";
import SheetBagAndButton from "./sheet-bag-and-button";
import { BagService } from "@/services/bag.service";
import { RentService } from "@/services/rent.service";

type Props = {
  book: Book;
};

const bagService = new BagService();
const rentsService = new RentService();

const FormRent = async ({ book }: Props) => {
  const bags = await bagService.GetAll();
  const rents = await rentsService.GetAllOfUser("pending");
  let booksRented = rents ? rents.data.reduce((acc, rent) => acc + rent.books.length, 0) : 0;

  return (
    <>
      <input hidden name="bookId" defaultValue={book.id} />
      <SheetBagAndButton
        bags={bags?.data ?? []}
        disabled={book.copiesAvaliable <= 0}
        rentsCount={booksRented}
      />
    </>
  );
};

export default FormRent;
