import { EStatusType } from "@/enums/EStatusType";

export type Author = {
  id: string;
  name: string;
  biography: string;
  dateBirth: string;
  status: keyof typeof EStatusType;
};
