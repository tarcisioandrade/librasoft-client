"use server";

import { BagService } from "@/services/bag.service";
import { getSession } from "@/services/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const bagService = new BagService();

// TODO: Toast notification if user has excedeed limit max of bag
export async function createBagAction(formData: FormData) {
  const bookId = formData.get("bookId")!.toString();
  const session = await getSession();
  if (!session) redirect("/signin");
  const created = await bagService.Create(bookId);
  if (created) {
    revalidatePath("/bag");
    redirect("/bag");
  }
  return created;
}
