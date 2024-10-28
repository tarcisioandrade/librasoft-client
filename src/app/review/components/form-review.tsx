"use client";

import { Star } from "lucide-react";
import React, { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateReview } from "@/actions/review/create.action";
import { useParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import Divider from "@/components/divider";
import ErrorMessage from "@/components/ui/error-message";

const FormReview = () => {
  const [rating, setRating] = useState(1);
  const params = useParams();
  const [state, formAction] = useActionState(CreateReview, {
    success: false,
    error: {},
  });

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <Star
          onClick={() => setRating(i)}
          fill="gold"
          color="gold"
          className="cursor-pointer"
          key={i}
        />,
      );
    } else {
      stars.push(
        <Star onClick={() => setRating(i)} className="cursor-pointer" color="gold" key={i} />,
      );
    }
  }

  async function action(formData: FormData) {
    formData.append("rating", String(rating));
    formAction(formData);
  }

  if (!state.success && "server" in state.error) {
    toast.error(state.error.server);
  }

  return (
    <>
      <div className="space-y-2">
        <strong className="text-lg">Classificar Avaliação</strong>
        <div className="flex items-center gap-1">{stars}</div>
      </div>
      <Divider />
      <form className="flex flex-col gap-6" action={action}>
        <div className="space-y-2">
          <label htmlFor="title" className="text-bold text-lg">
            Adicione um titulo
          </label>
          <Input id="title" name="title" placeholder="O que você achou?" required maxLength={90} />
          {!state.success && "title" in state.error && (
            <ErrorMessage>{state.error.title}</ErrorMessage>
          )}
        </div>
        <div className="h-px bg-slate-300" />
        <div className="space-y-2">
          <label htmlFor="comment" className="text-lg font-bold">
            Adicionar uma avaliação escrita
          </label>
          <Textarea
            id="comment"
            name="comment"
            placeholder="Do que você gostou ou não gostou?"
            required
            maxLength={1100}
            rows={15}
          />
          {!state.success && "comment" in state.error && (
            <ErrorMessage>{state.error.comment}</ErrorMessage>
          )}
        </div>
        <input hidden name="bookId" defaultValue={params.id?.toString()} />
        <input hidden name="callbackUrl" defaultValue={`/book/${params.id}`} />
        <div className="h-px bg-slate-300" />
        <Submit />
      </form>
    </>
  );
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="ml-auto block w-full sm:w-fit"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Enviando" : "Enviar"}
    </Button>
  );
}
export default FormReview;
