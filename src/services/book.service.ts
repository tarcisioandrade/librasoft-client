import { CacheKeys } from "@/cache-keys";
import { Constants } from "@/constants";
import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { CreateBookInputType } from "@/schemas/create-book.schema";
import { FilterParams } from "@/schemas/filterParams.schema";
import { Book, BookRelated } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { Err, Ok } from "@/utils/result";

type GetAllBooksFilterParams = Omit<FilterParams, "title" | "categories"> & {
  search?: string;
  category?: string;
};

export class BookService {
  private baseURL = `${env.BACKEND_URL}/book`;

  async GetAll(params: FilterParams) {
    const url = new URL(this.baseURL);

    const DEFAULT_PARAMS: GetAllBooksFilterParams = {
      pageSize: params.pageSize,
      pageNumber: params.pageNumber,
      status: params.status,
      search: params.title,
      category: params.categories,
    };

    const values = Object.entries(DEFAULT_PARAMS);

    values.forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const { data } = await $fetch<Pagination<Book>>(url.href, {
      next: { tags: [CacheKeys.Book.GetAll] },
    });

    return data!;
  }

  async GetById(id: string) {
    const res = await $fetch<Response<Book>>(`${this.baseURL}/${id}`);

    return res.data;
  }

  async GetRelated(id: string) {
    const res = await $fetch<Response<BookRelated[]>>(this.baseURL + `/${id}/related`);

    return res.data;
  }

  async Create(input: CreateBookInputType) {
    const { response } = await fetchWithCredentials("/book", {
      method: "POST",
      body: input,
    });

    return response.ok;
  }

  async Delete(id: string) {
    const { response, error } = await fetchWithCredentials(`/book/${id}/delete`, {
      method: "DELETE",
    });
    if (!response.ok && error) {
      return Err({ message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE });
    }
    return Ok({ message: "Livro deletado com sucesso!" });
  }

  async Reactivate(id: string) {
    const { response, error } = await fetchWithCredentials(`/book/${id}/reactivate`, {
      method: "POST",
    });
    if (!response.ok && error) {
      return Err({ message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE });
    }
    return Ok({ message: "Livro ativado com sucesso!" });
  }

  async Inactive(id: string) {
    const { response, error } = await fetchWithCredentials(`/book/${id}/inactive`, {
      method: "DELETE",
    });
    if (!response.ok && error) {
      return Err({ message: error.errors ?? Constants.DEFAULT_ERROR_MESSAGE });
    }
    return Ok({ message: "Livro inativado com sucesso!" });
  }
}
