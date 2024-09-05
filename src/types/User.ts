import { EUserRole } from "@/enums/EUserRole";
import { EUserStatus } from "@/enums/EUserStatus";

export type User = {
  id: string;
  name: string;
  email: string;
  telephone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  role: keyof typeof EUserRole;
  status: keyof typeof EUserStatus;
};
