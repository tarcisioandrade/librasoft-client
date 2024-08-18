"use server";

import { CacheKeys } from "@/cache-keys";
import { Constants } from "@/constants";
import { reviewSchema } from "@/schemas/review.schema";
import { ReviewService } from "@/services/review.service";
import { Err, Ok } from "@/utils/result";
import { revalidatePath, revalidateTag } from "next/cache";

type State =
  | {
      success: false;
      error: {
        title?: string[];
        comment?: string[];
        bookId?: string[];
        rating?: string[];
        server?: string[];
      };
    }
  | {
      success: true;
      value: string;
    };

export async function CreateReview(_prevState: State, formData: FormData) {
  const body = {
    title: formData.get("title"),
    comment: formData.get("comment"),
    rating: Number(formData.get("rating")),
    bookId: formData.get("bookId"),
  };

  const parse = reviewSchema.safeParse(body);

  if (!parse.success) {
    return Err(parse.error.flatten().fieldErrors);
  }

  const reviewService = new ReviewService();

  const res = await reviewService.Create(parse.data);
  if (!res) {
    return Err({ server: [Constants.DEFAULT_ERROR_MESSAGE] });
  }

  const callbackUrl = formData.get("callbackUrl")?.toString()!;
  revalidatePath(callbackUrl);
  revalidateTag(CacheKeys.Book.GetAll);
  return Ok(null);
}
