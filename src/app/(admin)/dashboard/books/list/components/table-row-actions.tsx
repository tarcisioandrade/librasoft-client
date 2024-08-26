"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { BookColumns } from "../colums";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import ActionRowDialog from "../../../components/table/action-row-dialog";
import { deleteBookAction } from "@/actions/book/delete.action";
import { inactiveBookAction } from "@/actions/book/inactive.action";
import { reactivateBookAction } from "@/actions/book/reactivate.action";

type Props = {
  row: Row<BookColumns>;
};

const TableRowActions = ({ row }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);

  const router = useRouter();

  return (
    <>
      <ActionRowDialog
        messageLabel="Esta ação não pode ser desfeita. Isso vai permanentemente deletar o livro do servidor."
        open={showDeleteDialog}
        row_id={row.original.id}
        onOpenChange={setShowDeleteDialog}
        action={deleteBookAction}
      />
      <ActionRowDialog
        messageLabel="Deseja inativar o livro?"
        open={showInactiveDialog}
        row_id={row.original.id}
        onOpenChange={setShowInactiveDialog}
        action={inactiveBookAction}
      />
      <ActionRowDialog
        messageLabel="Deseja reativar o livro?"
        open={showReactivateDialog}
        row_id={row.original.id}
        onOpenChange={setShowReactivateDialog}
        action={reactivateBookAction}
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
          <DropdownMenuItem
            onSelect={() => router.push(`/dashboard/books/${row.original.id}/edit`)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>Deletar</DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.original.status === "Inactive" ? (
            <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)}>
              Reativar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => setShowInactiveDialog(true)}>
              Inativar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TableRowActions;
