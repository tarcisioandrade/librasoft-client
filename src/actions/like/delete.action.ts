"use server";

import { CacheKeys } from "@/cache-keys";
import { LikeService } from "@/services/like.service";
import { revalidateTag } from "next/cache";

export async function deleteLike(formData: FormData) {
  const likeService = new LikeService();
  await likeService.Delete(formData.get("reviewId")!.toString());
  revalidateTag(CacheKeys.Review.GetAll);
}
