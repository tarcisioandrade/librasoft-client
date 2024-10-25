"use client";

import { ISheetBagAndButtonSummary } from "./sheet-bag-and-button.types";
import { useSheetBagAndButton } from "./sheet-bag-and-button.model";
import { SheetBagAndButtonActionService } from "./sheet-bag-and-button.service";
import SheetBagAndButton from "./sheet-bag-and-button.view";

export default function SheetBagAndButtonWrapper(summary: ISheetBagAndButtonSummary) {
  const service = new SheetBagAndButtonActionService();
  const methods = useSheetBagAndButton(service, summary);

  return <SheetBagAndButton {...methods} />;
}
