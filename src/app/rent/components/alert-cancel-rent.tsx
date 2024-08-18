"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelRentAction } from "@/actions/rent/cancel.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useTransition } from "react";

type Props = {
  rentId: string;
};

const AlertCancelRent = ({ rentId }: Props) => {
  const [isLoading, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  async function cancelAction(formData: FormData) {
    startTransition(async () => {
      const state = await cancelRentAction(formData);
      if (!state.success) toast.error(state.error.message);
      setModalOpen(false);
    });
  }

  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogTrigger asChild>
        <div className="mb-4 mr-4 grid place-items-end">
          <Button variant="destructive">Cancelar Solicitação</Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Cancelamento?</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={cancelAction}>
            <input hidden defaultValue={rentId} name="rentId" />
            <Button className="bg-red-500 hover:bg-red-500/90" type="submit">
              {isLoading ? "Confirmando..." : "Confirmar"}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertCancelRent;
