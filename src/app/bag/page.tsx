import Header from "@/components/header";
import React from "react";
import BagSection from "./components/bag-section";
import { BagService } from "@/services/bag.service";
import { RentService } from "@/services/rent.service";
import { Constants } from "@/constants";
import { UserService } from "@/services/user.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/services/session";

const bagService = new BagService();
const rentsService = new RentService();
const userService = new UserService();

const RentPage = async () => {
  const bags = await bagService.GetAll();
  const rents = await rentsService.GetAllOfUser("pending");
  const punishments = await userService.GetAllPunishments();
  const session = await getSession();

  let booksRented = rents ? rents.data.reduce((acc, rent) => acc + rent.books.length, 0) : 0;
  const BOOK_SELECTED_LIMIT = Constants.BOOK_RENT_MAX_LIMIT - booksRented;
  const NEXT_PUNISH_IS_PERMANENT_BAN = punishments?.data.length === 2;

  return (
    <>
      <Header />
      <div className="container my-6">
        <div className="flex flex-col gap-0.5">
          {booksRented > 0 && booksRented < 3 ? (
            <div className="mb-2 bg-yellow-200 p-2">
              <strong className="text-sm text-green-800">
                Você ja tem {booksRented} livro(s) com aluguel em andamento. Você pode alugar só
                mais {BOOK_SELECTED_LIMIT} livro(s).
              </strong>
            </div>
          ) : null}

          {booksRented >= 3 ? (
            <div className="mb-2 bg-yellow-200 p-2">
              <strong className="text-sm text-green-800">
                Você já alcançou o limite máximo de {Constants.BOOK_RENT_MAX_LIMIT} livros em
                alguel. Faça a devolução para fazer outro pedido. Verifique{" "}
                <Button className="h-fit p-0 text-blue-500" variant="link" asChild>
                  <Link href="/rent">Meus Aluguéis.</Link>
                </Button>
              </strong>
            </div>
          ) : null}

          {NEXT_PUNISH_IS_PERMANENT_BAN ? (
            <div className="mb-2 bg-red-200 p-2">
              <strong className="text-sm">
                CUIDADO! Sua conta está em risco de banimento permanente. Verifique seu{" "}
                <Button className="h-fit p-0 text-blue-500" variant="link" asChild>
                  <Link href="/account/punishments">Histórico de Punições.</Link>
                </Button>
              </strong>
            </div>
          ) : null}

          {session?.user.status === "Inactive" ? (
            <div className="mb-2 bg-red-200 p-2">
              <strong className="text-sm">
                AVISO! Sua conta está suspensa no momento, por esse motivo você não pode efetuar
                novos aluguéis. Verifique seu{" "}
                <Button className="h-fit p-0 text-blue-500" variant="link" asChild>
                  <Link href="/account/punishments"> Histórico de Punições.</Link>
                </Button>
              </strong>
            </div>
          ) : null}

          {session?.user.status === "Banned" ? (
            <div className="mb-2 bg-red-200 p-2">
              <strong className="text-sm">
                AVISO! Sua conta está banida, você não pode efetuar novos aluguéis. Verifique seu{" "}
                <Button className="h-fit p-0 text-blue-500" variant="link" asChild>
                  <Link href="/account/punishments">Histórico de Punições.</Link>
                </Button>
              </strong>
            </div>
          ) : null}

          {!session?.user.address ? (
            <div className="mb-2 bg-yellow-200 p-2">
              <strong className="text-sm">
                Complete as informações de sua conta para solicitar um alugúel. Acesse{" "}
                <Button className="h-fit p-0 text-blue-500" variant="link" asChild>
                  <Link href="/account/personal-data">sua conta.</Link>
                </Button>
              </strong>
            </div>
          ) : null}
        </div>

        <BagSection
          bags={bags ? bags.data : null}
          selectedLimit={BOOK_SELECTED_LIMIT}
          user={session!.user}
        />
      </div>
    </>
  );
};

export default RentPage;
