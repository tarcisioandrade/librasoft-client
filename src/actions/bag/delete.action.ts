"use server";

import { CacheKeys } from "@/cache-keys";
import { BagService } from "@/services/bag.service";
import { revalidateTag } from "next/cache";

const bagService = new BagService();

export async function deleteBagAction(formData: FormData) {
  const bagId = formData.get("bagId")!.toString();
  const deleted = await bagService.Delete(bagId);
  if (deleted) revalidateTag(CacheKeys.Bag.GetAll);
  return deleted;
}
