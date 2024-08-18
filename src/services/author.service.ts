import { $fetch } from "@/lib/fetch-base";
import { Author } from "@/types/Author";
import { Pagination } from "@/types/Pagination";

export class AuthorService {
  private baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/author`;

  async getAll(search?: string) {
    const url = new URL(this.baseURL);

    const DEFAULT_PARAMS = {
      pageSize: "10",
      includeInactive: "false",
      search,
    };

    const values = Object.entries(DEFAULT_PARAMS);

    values.forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    const { data } = await $fetch<Pagination<Author>>(url.href, { cache: "force-cache" });

    return data;
  }
}
