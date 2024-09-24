import Header from "@/components/header";
import Page from "@/components/page";
import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { ERentStatus } from "@/enums/ERentStatus";
import { cn } from "@/lib/utils";
import { RentService } from "@/services/rent.service";
import { formatDate } from "@/utils/format-date";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Book } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = generateCustomMetadata("Aluguéis");

const rentService = new RentService();

const RentPage = async () => {
  const rents = await rentService.GetAllOfUser();

  return (
    <>
      <Header />
      <Page container="container-third" asChild>
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-semibold leading-10">Aluguéis</h2>
            <p className="text-sm text-muted-foreground">Acompanhe aqui seus pedidos.</p>
          </div>
          <div className="flex flex-col border">
            {!rents?.data.length ? (
              <div className="grid h-48 place-items-center border">
                <p className="text-7xl uppercase text-muted-foreground/50">Vazio</p>
              </div>
            ) : null}
            {rents?.data.map((rent, i, array) => (
              <div
                key={rent.id}
                className={cn("pb-4 sm:p-4", array.length !== i + 1 && "border-b")}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 bg-secondary px-4 py-2 sm:bg-transparent sm:px-0 sm:py-0">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary">
                      <Book size={18} color="#fff" />
                    </div>
                    <div className="w-[230px] space-y-1">
                      <p className="text-sm">
                        <strong>Pedido: </strong>
                        {formatDate(rent.rentDate)}{" "}
                      </p>
                      <p className="text-sm">
                        <strong>Retorno:</strong> {formatDate(rent.expectedReturnDate)}{" "}
                      </p>
                    </div>
                  </div>
                  <p
                    className="self-center justify-self-start text-lg font-semibold sm:w-[130px] sm:text-xs"
                    style={{ color: Constants.STATUS_COLOR[rent.status] }}
                  >
                    {ERentStatus[rent.status]}
                  </p>
                  <Button
                    variant="secondary"
                    className="self-center text-xs text-muted-foreground"
                    asChild
                  >
                    <Link href={`/rent/${rent.id}/details`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Page>
    </>
  );
};

export default RentPage;
