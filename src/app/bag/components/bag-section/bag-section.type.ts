import { Bag } from "@/types/Bag";
import { User } from "@/types/User";
import { Err, Ok } from "@/utils/result";

export interface IBagSectionService {
  createRent: (books: { id: string }[]) => Promise<Err<{ message: string[] }> | Ok<null>>;
  deleteBag: (bagId: string) => Promise<boolean>;
}

export interface IBagSectionSummary {
  bags: Bag[] | null;
  selectedLimit: number;
  user: User;
}
