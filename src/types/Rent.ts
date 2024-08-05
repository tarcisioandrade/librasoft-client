import { ERentStatus } from "@/enums/ERentStatus";
import { Book } from "./Book";

export interface Rent {
  id: string;
  rentDate: string;
  expectedReturnDate: string;
  returnedDate: string | null;
  status: keyof typeof ERentStatus;
  books: BookInRent[];
}

type BookInRent = {
  author: {
    name: string;
  };
} & Pick<Book, "id" | "title" | "image" | "averageRating" | "coverType" | "publisher">;
