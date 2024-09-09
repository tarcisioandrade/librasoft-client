import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { Category } from "@/types/Category";
import { Response } from "@/types/Response";

export class CategoryService {
  private baseURL = `${env.BACKEND_URL}/category`;

  async getAll() {
    const req = await $fetch<Response<Category[]>>(this.baseURL, { cache: "no-cache" });
    return req.data;
  }
}
