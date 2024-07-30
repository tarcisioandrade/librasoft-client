import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { Book, BookRelated } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { Response } from "@/types/Response";

export class BookService {
  private baseURL = `${env.BACKEND_URL}/book`;

  async GetAll(params: { [key: string]: string | null }) {
    const url = new URL(this.baseURL);

    const DEFAULT_PARAMS = {
      pageSize: 25,
      pageNumber: 1,
      includeInactive: "false",
      ...params,
    };

    const values = Object.entries(DEFAULT_PARAMS);

    values.forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const { data } = await $fetch<Pagination<Book>>(url.href);

    return data;
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
