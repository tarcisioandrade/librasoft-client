import { EStatusType } from "@/enums/EStatusType";

export interface Punishment {
  punishInitDate: string;
  punishEndDate: string;
  status: keyof typeof EStatusType;
}
