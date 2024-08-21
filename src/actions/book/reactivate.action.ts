"use server";

import { CacheKeys } from "@/cache-keys";
import { BookService } from "@/services/book.service";
import { revalidateTag } from "next/cache";

const bookService = new BookService();

export async function reactivateBookAction(id: string) {
  const res = await bookService.Reactivate(id);
  if (res.success) {
    revalidateTag(CacheKeys.Book.GetAll);
  }
  return res;
}
