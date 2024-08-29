"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

type Props = {
  text: string;
};

const SinopseWrapper = ({ text }: Props) => {
  const [collapse, setCollapse] = useState(false);

  const sinopse = text.split("\r\n\r\n");
  const LIMIT_OF_CARACTERES = 1094;
  const needColapseButton = text.length > LIMIT_OF_CARACTERES;

  const paragraphElements = sinopse.map((paragraph, index) => (
    <p className="text-sm leading-relaxed" key={index}>
      {paragraph}
    </p>
  ));

  return (
    <div className={cn("relative max-h-60 overflow-hidden", collapse && "max-h-full")}>
      <div className={cn("space-y-2", needColapseButton && "pb-8")}>{paragraphElements}</div>
      {needColapseButton && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white shadow-[0px_-8px_10px_0px_rgba(255,255,255)]">
          {collapse ? (
            <Button
              variant="link"
              className="h-fit border-none p-1 text-xs outline-none"
              onClick={() => setCollapse(false)}
            >
              <ChevronUp size={16} />
              Leia Menos
            </Button>
          ) : (
            <Button
              variant="link"
              className="h-fit border-none p-1 text-xs outline-none"
              onClick={() => setCollapse(true)}
            >
              <ChevronDown size={16} />
              Leia Mais
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SinopseWrapper;
