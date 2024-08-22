"use server";

import { CacheKeys } from "@/cache-keys";
import { editBookInputSchema } from "@/schemas/edit-book.schema";
import { BookService } from "@/services/book.service";
import { revalidateTag } from "next/cache";

const bookService = new BookService();

export async function editBookAction(formData: FormData) {
  const input = {
    id: formData.get("id"),
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
      height: parseFloat(String(formData.get("height"))),
      depth: parseFloat(String(formData.get("depth"))),
    },
  };

  const parsed = editBookInputSchema.parse(input);
  const res = await bookService.Update(parsed);

  revalidateTag(CacheKeys.Book.GetAll);
  return res;
}
