import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import React, { useState } from "react";
import { RentsColumns } from "../columns";
import { Row } from "@tanstack/react-table";
import ActionRowDialog from "../../../components/table/action-row-dialog";
import { confirmRentAction } from "@/actions/rent/confirm.action";
import { cancelInDashboardRentAction } from "@/actions/rent/cancel-in-dashboard.action";
import { returnRentAction } from "@/actions/rent/return.action";
import Link from "next/link";

type Props = {
  row: Row<RentsColumns>;
};

const RentTableRowActions = ({ row }: Props) => {
  const [showConfirmRentDialog, setShowConfirmRentDialog] = useState(false);
  const [showCancelRentDialog, setShowCancelRentDialog] = useState(false);
  const [showFinishRentDialog, setShowFinishRentDialog] = useState(false);

  return (
    <>
      <ActionRowDialog
        messageLabel="Esta ação não pode ser desfeita. Isso vai permanentemente cancelar o aluguél do servidor."
        open={showCancelRentDialog}
        row_id={row.original.id}
        onOpenChange={setShowCancelRentDialog}
        action={cancelInDashboardRentAction}
      />
      <ActionRowDialog
        messageLabel="Cancelar aluguél?"
        open={showConfirmRentDialog}
        row_id={row.original.id}
        onOpenChange={setShowConfirmRentDialog}
        action={confirmRentAction}
      />
      <ActionRowDialog
        messageLabel="Confirmar recebimento de aluguél?"
        open={showFinishRentDialog}
        row_id={row.original.id}
        onOpenChange={setShowFinishRentDialog}
        action={returnRentAction}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            {/* O Certo seria eu criar uma tela para os detalhes aqui no dashboard, mas para economizar tempo reutilizárei a do usuário. */}
            <Link
              href={`/rent/${row.original.id}/details`}
              target="_blank"
              className="cursor-pointer"
            >
              Detalhes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={row.original.status !== "Requested_Awaiting_Pickup"}
            onSelect={() => setShowConfirmRentDialog(true)}
          >
            Confirmar
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              row.original.status === "Rent_Canceled" ||
              row.original.status === "Rent_Finished" ||
              row.original.status === "Rent_In_Progress"
            }
            onSelect={() => setShowCancelRentDialog(true)}
          >
            Cancelar
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              row.original.status === "Rent_Canceled" ||
              row.original.status === "Rent_Finished" ||
              row.original.status === "Requested_Awaiting_Pickup"
            }
            onSelect={() => setShowFinishRentDialog(true)}
          >
            Finalizar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RentTableRowActions;
