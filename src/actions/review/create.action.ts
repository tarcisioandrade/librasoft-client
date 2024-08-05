"use server";

import { Constants } from "@/constants";
import { reviewSchema } from "@/schemas/review.schema";
import { ReviewService } from "@/services/review.service";
import { revalidatePath } from "next/cache";

type State = {
  success: boolean;
  errors: {
    title?: string[];
    comment?: string[];
    bookId?: string[];
    rating?: string[];
    server?: string[];
  } | null;
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
    return { success: false, errors: parse.error.flatten().fieldErrors };
  }

  const reviewService = new ReviewService();

  try {
    const res = await reviewService.Create(parse.data);

    if (res) {
      const callbackUrl = formData.get("callbackUrl")?.toString()!;
      revalidatePath(callbackUrl);
    }

    return { success: true, errors: null };
  } catch (error) {
    return {
      success: false,
      errors: { server: [Constants.DEFAULT_ERROR_MESSAGE] },
    };
  }
}
