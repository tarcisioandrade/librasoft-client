import { CacheKeys } from "@/cache-keys";
import env from "@/env";
import { Response } from "@/types/Response";
import { Review } from "@/types/Review";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";

export class ReviewService {
  private baseURL = `${env.BACKEND_URL}/review`;

  async GetAll(bookId: string) {
    const res = await fetch(this.baseURL + `/${bookId}`, {
      next: { tags: [CacheKeys.Review.GetAll] },
    });
    const data = (await res.json()) as Response<Review[]>;
    return data;
  }

  async Create(
    review: Omit<Review, "id" | "createdAt" | "author" | "likesCount">,
  ) {
    const { response } = await fetchWithCredentials("/review", {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  }

  async Get(bookId: string) {
    const { data, response } = await fetchWithCredentials<Response<Review>>(
      `/review/${bookId}/user`,
    );

    return data;
  }
}
