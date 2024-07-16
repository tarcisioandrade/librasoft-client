import { Author } from "./Author";
import { Category } from "./Category";

export type Book = {
  id: string;
  title: string;
  publisher: string;
  image: string;
  isbn: string;
  publicationAt: string;
  copiesAvaliable: number;
  averageRating: number;
  reviewsCount: number;
  categories: Array<Category>;
  author: Author;
  status: string;
};
