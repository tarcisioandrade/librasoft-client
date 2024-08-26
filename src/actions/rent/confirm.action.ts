"use server";

import { CacheKeys } from "@/cache-keys";
import { RentService } from "@/services/rent.service";
import { revalidateTag } from "next/cache";

const rentService = new RentService();

export async function confirmRentAction(id: string) {
  const res = await rentService.Confirm(id);
  if (res.success) {
    revalidateTag(CacheKeys.Rent.GetAll);
  }
  return res;
}
