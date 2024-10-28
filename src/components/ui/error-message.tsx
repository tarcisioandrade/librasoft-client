import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"p"> & {
  children: React.ReactNode;
};

export default function ErrorMessage({ className, ...props }: Props) {
  return (
    <p data-testid="error-message" className={cn("text-xs text-destructive", className)} {...props}>
      {props.children}
    </p>
  );
}
