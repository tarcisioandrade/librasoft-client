"use server";

import { RentService } from "@/services/rent.service";
import { revalidatePath } from "next/cache";

const rentService = new RentService();

export async function cancelRentAction(formData: FormData) {
  const rentId = formData.get("rentId")!.toString();
  const response = await rentService.Delete(rentId);

  if (response.success) revalidatePath(`/rent/${rentId}`);
  return response;
}
