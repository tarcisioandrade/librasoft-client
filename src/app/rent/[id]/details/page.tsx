import Header from "@/components/header";
import StarRating from "@/components/star-rating";
import { ECoverType } from "@/enums/ECoverType";
import { ERentStatus } from "@/enums/ERentStatus";
import { cn } from "@/lib/utils";
import { RentService } from "@/services/rent.service";
import { formatDate } from "@/utils/format-date";
import { formatTime } from "@/utils/format-time";
import { BookOpenText, Box, Check, Clock, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AlertCancelRent from "../../components/alert-cancel-rent";
import { Metadata } from "next";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";

export const metadata: Metadata = generateCustomMetadata("Detalhes");

const rentService = new RentService();

const RentDetailsPage = async ({ params }: { params: { id: string } }) => {
  const rent = await rentService.Get(params.id);
  if (!rent) notFound();

  const isReturnLate = rent.data.returnedDate
    ? new Date(rent.data.returnedDate).getTime() > new Date(rent.data.expectedReturnDate).getTime()
    : false;

  return (
    <>
      <Header />
      <section className="container-third my-6">
        <div className="border">
          <header className="w-full bg-secondary px-4 py-2">
            <p className="text-sm text-muted-foreground">Status da Solicitação</p>
          </header>
          <div className="flex items-start justify-around gap-12 p-4">
            {rent.data.status === "Rent_Canceled" ? (
              <div className={cn("flex flex-col items-center justify-center gap-2 text-red-700")}>
                <X size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">Cancelado</p>
                </div>
              </div>
            ) : (
              <div className={cn("flex flex-col items-center justify-center gap-2 text-green-500")}>
                <Box size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">Solicitado</p>
                  <p className="text-xs">
                    {formatDate(rent.data.rentDate, { dateStyle: "short" })} :{" "}
                    {formatTime(rent.data.rentDate)}
                  </p>
                </div>
              </div>
            )}
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 text-muted-foreground",
                rent.data.status === "Requested_Awaiting_Pickup" && "text-yellow-500",
                rent.data.status !== "Rent_Canceled" &&
                  rent.data.status !== "Requested_Awaiting_Pickup" &&
                  "text-green-500",
              )}
            >
              <Clock size={36} />
              <div className="text-center">
                <p className="text-xs font-semibold">{ERentStatus.Requested_Awaiting_Pickup}</p>
              </div>
            </div>
            {rent.data.status === "Rent_Expired" ? (
              <div className={cn("flex flex-col items-center justify-center gap-2 text-red-500")}>
                <Clock size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">{ERentStatus.Rent_Expired}</p>
                  <p className="text-xs font-semibold">Uma punição será aplicada</p>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2 text-muted-foreground",
                  rent.data.status === "Rent_Finished" && "text-green-500",
                  rent.data.status === "Rent_In_Progress" && "text-yellow-500",
                )}
              >
                <BookOpenText size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">{ERentStatus.Rent_In_Progress}</p>
                </div>
              </div>
            )}
            {isReturnLate ? (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2 text-muted-foreground text-red-500",
                )}
              >
                <Check size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">{ERentStatus.Rent_Finished} com Atraso</p>
                  <p className="text-xs">
                    {formatDate(rent.data.returnedDate!, { dateStyle: "short" })}
                  </p>
                  <p className="text-xs">Uma punição foi aplicada!</p>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2 text-muted-foreground",
                  rent.data.status === "Rent_Finished" && "text-green-500",
                )}
              >
                <Check size={36} />
                <div className="text-center">
                  <p className="text-xs font-semibold">{ERentStatus.Rent_Finished}</p>
                  <p className="text-xs">
                    {formatDate(rent.data.returnedDate ?? rent.data.expectedReturnDate, {
                      dateStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border">
          <header className="w-full bg-secondary px-4 py-2">
            <p className="text-sm text-muted-foreground">Resumo da Solicitação</p>
          </header>

          <div className="flex flex-col gap-4 p-4">
            {rent.data.books.map((book) => (
              <div key={book.id} className="flex gap-4 border p-2">
                <Link
                  href={`/book/${book.id}`}
                  target="_blank"
                  className="h-[123px] w-24 rounded bg-muted"
                >
                  <Image
                    src={book.image}
                    width={215}
                    height={284}
                    alt={book.title}
                    className="h-full"
                  />
                </Link>
                <div>
                  <ul className="space-y-1">
                    <li className="font-semibold">
                      <Link href={`/book/${book.id}`} target="_blank">
                        {book.title} -{" "}
                        <span className="text-muted-foreground">{book.publisher}</span>
                      </Link>
                    </li>
                    <li>
                      <StarRating rating={5} size={12} />
                    </li>
                    <li className="text-xs text-muted-foreground">por {book.author.name}</li>
                    <li className="text-xs text-muted-foreground">{ECoverType[book.coverType]}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {rent.data.status === "Requested_Awaiting_Pickup" ? (
            <AlertCancelRent rentId={rent.data.id} />
          ) : null}
        </div>
      </section>
    </>
  );
};

export default RentDetailsPage;
