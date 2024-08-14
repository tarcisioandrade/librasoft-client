import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { FilterParams } from "@/schemas/filterParams.schema";
import { Book, BookRelated } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { Response } from "@/types/Response";

export class BookService {
  private baseURL = `${env.BACKEND_URL}/book`;

  async GetAll(params: FilterParams) {
    const url = new URL(this.baseURL);

    const DEFAULT_PARAMS = {
      pageSize: params.pageSize ?? "10",
      pageNumber: params.pageNumber ?? "1",
      includeInactive: params.includeInactive ?? "false",
      search: params.title,
      category: params.categories,
    };

    console.log('category', params)
    const values = Object.entries(DEFAULT_PARAMS);

    values.forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const { data } = await $fetch<Pagination<Book>>(url.href);

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
}
