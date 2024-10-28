"use client";

import { IFormUserDataSummary } from "./form-user-data.type";
import { FormUserDataActionService } from "./form-user-data.service";
import { useFormUserDataModel } from "./form-user-data.model";
import FormUserData from "./form-user-data.view";

export default function FormUserDataWrapper(summary: IFormUserDataSummary) {
  const service = new FormUserDataActionService();
  const methods = useFormUserDataModel(service, summary);

  return <FormUserData {...methods} />;
}
