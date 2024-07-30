import { BookInBag } from "./Book";

export type Bag = {
  id: string;
  book: BookInBag;
  createdAt: string;
};
