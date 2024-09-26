"use server";

import { CacheKeys } from "@/cache-keys";
import { BookActionType, BookService } from "@/services/book.service";
import { revalidateTag } from "next/cache";

const bookService = new BookService();

export async function bookAction(id: string, actionType: BookActionType) {
  const res = await bookService.Action(id, actionType);
  if (res.success) {
    revalidateTag(CacheKeys.Book.GetAll);
  }
  return res;
}
