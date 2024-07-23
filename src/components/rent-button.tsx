"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  bookId: string;
  children: ReactNode;
} & ButtonProps;

type Rent = {
  id: string;
};

const RentButton = ({ bookId, children, ...rest }: Props) => {
  const router = useRouter();

  function goToRentsPage() {
    let rentsInLocalStorage = localStorage.getItem("rents");
    let rents: Array<Rent> = [];

    try {
      rents = rentsInLocalStorage
        ? (JSON.parse(rentsInLocalStorage) as Array<Rent>)
        : [];
    } catch (error) {
      console.error("Error parsing rents from localStorage:", error);
    }

    rents = rents.some((r) => r.id === bookId)
      ? rents
      : [...rents, { id: bookId }];

    localStorage.setItem("rents", JSON.stringify(rents));
    router.push("/rent");
  }

  return (
    <Button onClick={goToRentsPage} {...rest}>
      {children}
    </Button>
  );
};

export default RentButton;
