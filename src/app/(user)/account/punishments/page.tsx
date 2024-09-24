import { UserService } from "@/services/user.service";
import React from "react";
import { formatDate } from "@/utils/format-date";
import { EStatusType } from "@/enums/EStatusType";
import { getSession } from "@/services/session.service";
import { EUserStatus } from "@/enums/EUserStatus";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateCustomMetadata("Histórico de Punições");

const userService = new UserService();

const PunishmentsPage = async () => {
  const punishments = await userService.GetAllPunishments();
  const session = await getSession();

  const PUNISHMENT_IN_PROGRESS_INDEX = punishments?.data.findIndex(
    (punishment) => new Date(punishment.punishEndDate).getTime > new Date().getTime,
  );

  const NEXT_PUNISH_IS_PERMANENT_BAN = punishments?.data.length === 2;

  return (
    <>
      <header className="w-full bg-secondary px-4 py-2">
        <p className="text-sm text-muted-foreground">Histórico de Punições</p>
      </header>
      <div className="mb-4 mt-1 space-y-1 px-4">
        <h1 className="text-2xl">
          Status do Usúario:{" "}
          <span
            className={cn("text-red-500", session?.user.status === "Active" && "text-green-500")}
          >
            {EUserStatus[session!.user.status]}
          </span>
        </h1>
        {session?.user.status === "Active" ? (
          <p className="text-sm text-muted-foreground">
            Você está apto para alugar livros aqui :).
          </p>
        ) : null}
      </div>
      <Table className="w-[700px] lg:w-full">
        {NEXT_PUNISH_IS_PERMANENT_BAN ? (
          <TableCaption className="text-sm text-red-500">
            <strong className="text-sm text-red-500">
              AVISO! Mais uma punição e sua conta será suspensa permanentemente.
            </strong>
          </TableCaption>
        ) : null}
        <TableHeader className="border-t">
          <TableRow>
            <TableHead className="w-[100px]">Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {punishments?.data.length ? (
            punishments?.data.map((punish, i) => (
              <TableRow
                key={i}
                className={cn(i === PUNISHMENT_IN_PROGRESS_INDEX && "font-semibold text-red-500")}
              >
                <TableCell>{formatDate(punish.punishInitDate, { dateStyle: "short" })}</TableCell>
                <TableCell>{formatDate(punish.punishEndDate, { dateStyle: "short" })}</TableCell>
                <TableCell>Atraso no retorno do aluguél.</TableCell>
                <TableCell className="text-right">{EStatusType[punish.status]}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default PunishmentsPage;
