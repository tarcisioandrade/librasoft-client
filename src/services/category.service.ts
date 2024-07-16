import env from "@/env";
import { Category } from "@/types/Category";

export class CategoryService {
  private baseURL = `${env.BACKEND_URL}/category`;

  async getCategories() {
    const request = await fetch(this.baseURL);
    const data = (await request.json()) as Array<Category>;
    return data;
  }
}
