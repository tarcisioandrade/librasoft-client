import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Row } from "@tanstack/react-table";
import React, { useTransition } from "react";
import { BookColumns } from "../list/colums";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { type Err, type Ok } from "@/utils/result";

type ActionReturn =
  | Err<{
      message: string[];
    }>
  | Ok<{
      message: string;
    }>;

type DeleteTasksDialogProps = {
  row: Row<BookColumns>["original"];
  showTrigger?: boolean;
  onSuccess?: () => void;
  messageLabel: string;
  action: (id: string) => Promise<ActionReturn>;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

const ActionRowDialog = ({ row, messageLabel, onSuccess, ...props }: DeleteTasksDialogProps) => {
  const [isLoading, startTransition] = useTransition();

  function actionFn() {
    startTransition(async () => {
      const result = await props.action(row.id);
      props.onOpenChange?.(false);
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success(result.value.message);
      onSuccess?.();
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>{messageLabel}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={actionFn}
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionRowDialog;
