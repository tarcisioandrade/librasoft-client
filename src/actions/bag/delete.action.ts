"use server";

import { CacheKeys } from "@/cache-keys";
import { BagService } from "@/services/bag.service";
import { revalidateTag } from "next/cache";

const bagService = new BagService();

export async function deleteBagAction(bagId: string) {
  const deleted = await bagService.Delete(bagId);
  if (deleted) revalidateTag(CacheKeys.Bag.GetAll);
  return deleted;
}
