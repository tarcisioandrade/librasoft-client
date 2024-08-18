import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { Category } from "@/types/Category";

export class CategoryService {
  private baseURL = `${env.BACKEND_URL}/category`;

  async getAll() {
    const req = await $fetch<Category[]>(this.baseURL, { cache: "force-cache" });
    return req.data;
  }
}
