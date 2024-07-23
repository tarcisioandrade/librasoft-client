import env from "@/env";
import { $fetch } from "@/lib/fetch-base";
import { Category } from "@/types/Category";

export class CategoryService {
  private baseURL = `${env.BACKEND_URL}/category`;

  async getCategories() {
    const req = await $fetch<Category[]>(this.baseURL);
    return req.data;
  }
}
