import { ERentStatus } from "@/enums/ERentStatus";
import { Book } from "./Book";
import { User } from "@/schemas/user.schema";

export interface Rent {
  id: string;
  rentDate: string;
  expectedReturnDate: string;
  returnedDate: string | null;
  status: keyof typeof ERentStatus;
  books: BookInRent[];
  user: UserInRent;
}

type BookInRent = {
  author: {
    name: string;
  };
} & Pick<Book, "id" | "title" | "image" | "averageRating" | "coverType" | "publisher">;

type UserInRent = Pick<User, "id" | "email" | "name">;
