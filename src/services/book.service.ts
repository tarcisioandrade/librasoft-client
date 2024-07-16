import env from "@/env";
import { Book } from "@/types/Book";
import { Pagination } from "@/types/Pagination";
import { Response } from "@/types/Response";

export class BookService {
  private baseURL = `${env.BACKEND_URL}/book`;

  async GetBooks(params: { [key: string]: string | null }) {
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

    const res = await fetch(url.href);
    const data = (await res.json()) as Pagination<Book>;

    return data;
  }

  async GetBookById(id: string) {
    const res = await fetch(`${this.baseURL}/${id}`);
    const data = (await res.json()) as Response<Book>;

    return data;
  }
}
