import { ECoverType } from "@/enums/ECoverType";
import { Author } from "./Author";
import { Category } from "./Category";

export type Book = {
  id: string;
  title: string;
  publisher: string;
  image: string;
  isbn: string;
  publicationAt: string;
  pageCount: number;
  sinopse: string;
  language: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  coverType: ECoverType;
  copiesAvaliable: number;
  averageRating: number;
  reviewsCount: number;
  categories: Array<Category>;
  author: Author;
  status: string;
};

export type BookRelated = {
  id: string;
  title: string;
  authorName: string;
  image: string;
  averageRating: number;
  coverType: ECoverType;
};
