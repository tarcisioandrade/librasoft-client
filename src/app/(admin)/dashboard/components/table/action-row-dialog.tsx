import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { BookActionType } from "@/services/book.service";
import { bookAction } from "@/actions/book/action";
import { RentActionType } from "@/services/rent.service";
import { rentAction } from "@/actions/rent/action";

type ActionDialogConfig =
  | { entity: "rent"; action: RentActionType }
  | { entity: "book"; action: BookActionType };

type TasksDialogProps = {
  row_id: string;
  showTrigger?: boolean;
  onSuccess?: () => void;
  messageLabel: string;
  config: ActionDialogConfig;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

const ActionRowDialog = ({
  row_id,
  messageLabel,
  config,
  onSuccess,
  ...props
}: TasksDialogProps) => {
  const [isLoading, startTransition] = useTransition();

  function actionFn() {
    startTransition(async () => {
      const result =
        config.entity === "book"
          ? await bookAction(row_id, config.action)
          : await rentAction(row_id, config.action);
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
