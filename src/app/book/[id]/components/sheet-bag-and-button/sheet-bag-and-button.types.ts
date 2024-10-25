import { Bag } from "@/types/Bag";
import { User } from "@/types/User";

export interface ISheetBagAndButtonService {
  createBag: (bookId: string) => Promise<boolean>;
  deleteBag: (bagId: string) => Promise<boolean>;
}

export interface ISheetBagAndButtonSummary {
  bags: Bag[];
  rentsCount: number;
  session?: User;
}
