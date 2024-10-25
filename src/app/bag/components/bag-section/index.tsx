"use client"

import React from "react";
import { IBagSectionSummary } from "./bag-section.type";
import BagSection from "./bag-section.view";
import { useBagSectionModel } from "./bag-section.model";
import { BagSectionActionService } from "./bag-section.service";

export default function BagSectionWrapper(summary: IBagSectionSummary) {
  const service = new BagSectionActionService();
  const methods = useBagSectionModel(service, summary);

  return <BagSection {...methods} />;
}
