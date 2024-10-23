"use client";

import React from "react";
import { useFormSigninModel } from "./form.model";
import { FormActionService } from "./form.service";
import FormSignin from "./form-signin.view";

export default function FormSigninWrapper() {
  const service = new FormActionService();
  const methods = useFormSigninModel(service);

  return <FormSignin {...methods} />;
}
