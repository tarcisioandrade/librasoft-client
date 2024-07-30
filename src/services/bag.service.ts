import { CacheKeys } from "@/cache-keys";
import { Bag } from "@/types/Bag";
import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";

export class BagService {
  private readonly endpoint = "/bag";

  async GetAll() {
    const { data } = await fetchWithCredentials<Response<Bag[]>>(this.endpoint, {
      next: { tags: [CacheKeys.Bag.GetAll] },
      cache: "force-cache",
    });
    return data;
  }

  async Create(bookId: string) {
    const { response } = await fetchWithCredentials(this.endpoint, {
      method: "POST",
      body: JSON.stringify({ bookId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  }

  async Delete(bagId: string) {
    const { response } = await fetchWithCredentials(this.endpoint + `/${bagId}`, {
      method: "DELETE",
    });
    return response.ok;
  }
}
