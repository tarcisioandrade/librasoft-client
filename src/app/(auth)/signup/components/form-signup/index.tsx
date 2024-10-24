"use client";

import React from "react";
import { useFormSignupModel } from "./form-signup.model";
import FormSignup from "./form-signup.view";
import { FormSignupActionService } from "./form-signup.service";

export default function FormSignupWrapper() {
  const service = new FormSignupActionService();
  const methods = useFormSignupModel(service);

  return <FormSignup {...methods} />;
}
