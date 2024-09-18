import { Session } from "@/services/session.service";
import { Category } from "./Category";

export type HeaderProps = {
  session: Session;
  bagCount: number | null;
  profileStatus: boolean;
  callbackUrl: string | null;
  categories: Category[];
};
