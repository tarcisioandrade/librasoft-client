"use server";

import { CacheKeys } from "@/cache-keys";
import { RentService } from "@/services/rent.service";
import { revalidateTag } from "next/cache";

const rentService = new RentService();

export async function cancelInDashboardRentAction(id: string) {
  const res = await rentService.Action(id, "delete");
  if (res.success) {
    revalidateTag(CacheKeys.Rent.GetAll);
  }
  return res;
}
