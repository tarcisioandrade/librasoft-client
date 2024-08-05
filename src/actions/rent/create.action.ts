"use server";

import { RentService } from "@/services/rent.service";

const rentService = new RentService();

export async function createRentAction(formData: FormData) {
  const books = JSON.parse(String(formData.get("books"))) as Array<{ id: string }>;
  const response = await rentService.Create(books);
  if (!response.success) return response;
  return response;
}
