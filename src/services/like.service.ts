import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";

export class LikeService {
  async Create(reviewId: string) {
    const { data } = await fetchWithCredentials<
      Response<{ likesCount: number }>
    >("/like", {
      method: "POST",
      body: JSON.stringify({ reviewId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  }

  async Get(reviewId: string) {
    const { response } = await fetchWithCredentials(`/like/${reviewId}`);

    return response.status === 200;
  }

  async Delete(reviewId: string) {
    const { data } = await fetchWithCredentials<
      Response<{ likesCount: number }>
    >(`/like/${reviewId}`, {
      method: "DELETE",
    });

    return data;
  }
}
