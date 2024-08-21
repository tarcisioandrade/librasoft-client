"use server";

import { CacheKeys } from "@/cache-keys";
import { createBookInputSchema } from "@/schemas/create-book.schema";
import { BookService } from "@/services/book.service";
import { revalidateTag } from "next/cache";

const bookService = new BookService();

export async function createBookAction(formData: FormData) {
  const input = {
    title: formData.get("title"),
    image: formData.get("image"),
    isbn: formData.get("isbn"),
    language: formData.get("language"),
    coverType: formData.get("coverType"),
    copiesAvailable: Number(formData.get("copiesAvailable")),
    publisher: formData.get("publisher"),
    publicationAt: formData.get("publicationAt"),
    sinopse: formData.get("sinopse"),
    categories: JSON.parse(String(formData.get("categories"))),
    authorId: formData.get("authorId"),
    pageCount: Number(formData.get("pageCount")),
    dimensions: {
      width: parseFloat(String(formData.get("width"))),
      heigth: parseFloat(String(formData.get("heigth"))),
      depth: parseFloat(String(formData.get("depth"))),
    },
  };

  const parsed = createBookInputSchema.safeParse(input);

  if (!parsed.success) return false;

  const res = await bookService.Create(parsed.data);
  revalidateTag(CacheKeys.Book.GetAll);
  return res;
}
