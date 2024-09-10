import { ECoverType } from "@/enums/ECoverType";
import { Author } from "./Author";
import { Category } from "./Category";
import { EStatusType } from "@/enums/EStatusType";

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
  coverType: keyof typeof ECoverType;
  copiesAvaliable: number;
  averageRating: number;
  reviewsCount: number;
  categories: Array<Category>;
  author: Author;
  status: keyof typeof EStatusType;
  created_At: string;
};

export type BookRelated = {
  id: string;
  title: string;
  authorName: string;
  image: string;
  averageRating: number;
  coverType: keyof typeof ECoverType;
};

export interface BookInBag {
  id: string;
  title: string;
  publisher: string;
  image: string;
  copiesAvaliable: number;
  averageRating: number;
  coverType: keyof typeof ECoverType;
  status: keyof typeof EStatusType;
}
