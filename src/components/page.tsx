import { cn } from "@/lib/utils";
import React, { ComponentPropsWithRef, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

interface Props extends ComponentPropsWithRef<"div"> {
  withHeader?: boolean;
  asChild?: boolean;
  container: "container" | "container-secondary" | "container-third";
}

const Page = forwardRef<HTMLDivElement, Props>(
  ({ className, children, asChild, container, withHeader = true, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(container, { "mt-[105px] lg:mt-0": withHeader }, className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Page.displayName = "Page";

export default Page;
