import { CacheKeys } from "@/cache-keys";
import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { CreateBookInputType } from "@/schemas/create-book.schema";
import { EditBookInputType } from "@/schemas/edit-book.schema";
import { FilterBooksParams } from "@/schemas/filterParams.schema";
import { Book, BookRelated } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { Response } from "@/types/Response";
import { fetchWithCredentials } from "@/utils/fetch-with-credentials";
import { Err, Ok } from "@/utils/result";

type GetAllBooksFilterParams = Omit<FilterBooksParams, "title" | "categories"> & {
  search?: string;
  category?: string;
};

export type BookActionType = "inactive" | "reactive" | "delete";

export class BookService {
  private baseURL = `${env.BACKEND_URL}/book`;

  async GetAll(params: FilterBooksParams) {
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
    const { response, error } = await fetchWithCredentials("/book", {
      method: "POST",
      body: input,
    });
    if (!response.ok && error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: "Livro adicionado com sucesso!" });
  }

  async Action(id: string, actionType: BookActionType) {
    const { response, error } = await fetchWithCredentials(`/book/${id}/${actionType}`, {
      method: "POST",
    });
    if (!response.ok && error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: `Ação [${actionType}] aplicada com sucesso!` });
  }

  async Update(input: EditBookInputType) {
    const { response, error } = await fetchWithCredentials("/book", {
      method: "PUT",
      body: input,
    });
    if (!response.ok && error) {
      return Err({ message: error.errors });
    }
    return Ok({ message: "Livro atualizado com sucesso!" });
  }
}
