"use server";

import { RentService } from "@/services/rent.service";

const rentService = new RentService();

export async function createRentAction(books: { id: string }[]) {
  const response = await rentService.Create(books);
  if (!response.success) return response;
  return response;
}
