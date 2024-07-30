import { Constants } from "@/constants";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";

export class RentService {
  private readonly endpoint = "/rent";

  async Create(books: Array<{ id: string }>) {
    const { error } = await fetchWithCredentials(this.endpoint, {
      method: "POST",
      body: { rentDate: new Date(), books },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE,
        },
      };
    }

    return { success: true, error: null };
  }
}
