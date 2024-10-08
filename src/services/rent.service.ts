import { CacheKeys } from "@/cache-keys";
import { FilterRentsParams } from "@/schemas/filterParams.schema";
import { Pagination } from "@/types/Pagination";
import { Rent } from "@/types/Rent";
import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { Err, Ok } from "@/utils/result";
import env from "@/env";

type GetAllRentsFilterParams = Omit<FilterRentsParams, "search"> & {
  search?: string;
};

export type RentActionType = "confirm" | "delete" | "return";

export class RentService {
  private readonly endpoint = "/rent";

  async Create(books: Array<{ id: string }>) {
    const { error } = await fetchWithCredentials(this.endpoint, {
      method: "POST",
      body: { rentDate: new Date(), books },
    });
    if (error) {
      return Err({
        message: error.errors,
      });
    }
    return Ok(null);
  }

  async GetAllOfUser(status: "all" | "pending" | "complete" = "all") {
    const { data } = await fetchWithCredentials<Response<Rent[]>>(this.endpoint + `/user`, {
      query: { status },
    });
    return data;
  }

  async Get(id: string) {
    const { data } = await fetchWithCredentials<Response<Rent>>(this.endpoint + `/${id}`);
    return data;
  }

  async Action(id: string, actionType: RentActionType) {
    const { error } = await fetchWithCredentials(this.endpoint + `/${id}/${actionType}`, {
      method: "POST",
    });
    if (error) {
      return Err({
        message: error.errors,
      });
    }
    return Ok({ message: "Solicitação concluída com sucesso!" });
  }

  async GetAll(params: FilterRentsParams) {
    const url = new URL(env.BACKEND_URL + this.endpoint);

    const DEFAULT_PARAMS: GetAllRentsFilterParams = {
      pageSize: params.pageSize,
      pageNumber: params.pageNumber,
      status: params.status,
      search: params.user_email,
    };

    const values = Object.entries(DEFAULT_PARAMS);

    values.forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const { data } = await fetchWithCredentials<Pagination<Rent>>(this.endpoint + url.search, {
      next: { tags: [CacheKeys.Rent.GetAll] },
    });

    return data!;
  }
}
