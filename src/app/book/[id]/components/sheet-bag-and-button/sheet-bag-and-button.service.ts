import { createBagAction } from "@/actions/bag/create.action";
import { ISheetBagAndButtonService } from "./sheet-bag-and-button.types";
import { deleteBagAction } from "@/actions/bag/delete.action";

export class SheetBagAndButtonActionService implements ISheetBagAndButtonService {
  async createBag(bookId: string) {
    return await createBagAction(bookId);
  }

  async deleteBag(bookId: string) {
    return await deleteBagAction(bookId);
  }
}
