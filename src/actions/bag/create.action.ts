"use server";

import { CacheKeys } from "@/cache-keys";
import { BagService } from "@/services/bag.service";
import { getSession } from "@/services/session.service";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const bagService = new BagService();

export async function createBagAction(bookId: string) {
  const session = await getSession();
  if (!session) redirect("/signin");
  const created = await bagService.Create(bookId);
  if (created) {
    revalidateTag(CacheKeys.Bag.GetAll);
  }
  return created;
}
