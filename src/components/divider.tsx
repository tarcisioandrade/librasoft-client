import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div">;

const Divider = ({ className, ...rest }: Props) => {
  return <div className={cn("my-2 h-px bg-slate-300", className)} {...rest} />;
};

export default Divider;
