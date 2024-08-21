"use server";

import { CacheKeys } from "@/cache-keys";
import { BookService } from "@/services/book.service";
import { revalidateTag } from "next/cache";

const bookService = new BookService();

// TODO: Refatorar delete, inactive, reactivate em um methodo e um endpoint;

export async function deleteBookAction(id: string) {
  const res = await bookService.Delete(id);
  if (res.success) {
    revalidateTag(CacheKeys.Book.GetAll);
  }
  return res;
}
