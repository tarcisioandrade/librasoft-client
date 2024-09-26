"use server";

import { CacheKeys } from "@/cache-keys";
import { RentActionType, RentService } from "@/services/rent.service";
import { revalidateTag } from "next/cache";

const rentService = new RentService();

export async function rentAction(id: string, actionType: RentActionType) {
  const res = await rentService.Action(id, actionType);
  if (res.success) {
    revalidateTag(CacheKeys.Rent.GetAll);
  }
  return res;
}
