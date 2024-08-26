import colors from "tailwindcss/colors";
import { ERentStatus } from "./enums/ERentStatus";

export class Constants {
  static DEFAULT_ERROR_MESSAGE = "Ocorreu um erro inesperado, por favor, tente novamente.";
  static AMOUNT_DAY_TO_RETURN_BOOK = 30;
  static STATUS_COLOR: { [key in keyof typeof ERentStatus]: string } = {
    Requested_Awaiting_Pickup: colors.orange[400],
    Rent_Finished: colors.green[400],
    Rent_In_Progress: colors.blue[400],
    Rent_Expired: colors.red[400],
    Rent_Canceled: colors.red[700],
  };
}
