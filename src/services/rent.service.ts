import { Constants } from "@/constants";
import { Rent } from "@/types/Rent";
import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { Err, Ok } from "@/utils/result";

export class RentService {
  private readonly endpoint = "/rent";

  async Create(books: Array<{ id: string }>) {
    const { error } = await fetchWithCredentials(this.endpoint, {
      method: "POST",
      body: { rentDate: new Date(), books },
    });
    if (error) {
      return Err({
        message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE,
      });
    }
    return Ok(null);
  }

  async GetAll(status: "all" | "pending" | "complete" = "all") {
    const { data } = await fetchWithCredentials<Response<Rent[]>>(this.endpoint, {
      query: { status },
    });
    return data;
  }

  async Get(id: string) {
    const { data } = await fetchWithCredentials<Response<Rent>>(this.endpoint + `/${id}`);
    return data;
  }

  async Delete(id: string) {
    const { error } = await fetchWithCredentials(this.endpoint + `/${id}`, {
      method: "DELETE",
    });
    if (error) {
      return Err({
        message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE,
      });
    }
    return Ok(null);
  }
}
