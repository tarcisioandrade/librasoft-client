import { IBagSectionService } from "./bag-section.type";
import { createRentAction } from "@/actions/rent/create.action";
import { deleteBagAction } from "@/actions/bag/delete.action";

export class BagSectionActionService implements IBagSectionService {
  async createRent(books: { id: string }[]) {
    return await createRentAction(books);
  }
  async deleteBag(bagId: string) {
    return await deleteBagAction(bagId);
  }
}
