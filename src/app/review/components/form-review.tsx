"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateReview } from "@/actions/review/create.action";
import { useParams, useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import Divider from "@/components/divider";

const initialState = {
  success: false,
  errors: null,
};

const FormReview = () => {
  const [rating, setRating] = useState(1);
  const params = useParams();
  const route = useRouter();
  const [state, formAction] = useFormState(CreateReview, initialState);

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

  if (state && state.errors && "server" in state.errors) {
    toast.error(state.errors.server);
  }

  if (state.success) {
    route.push(`/book/${params.id}`);
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
          {state.errors && "title" in state.errors && (
            <p className="text-xs text-destructive">{state.errors.title}</p>
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
          {state.errors && "comment" in state.errors && (
            <p className="text-xs text-destructive">{state.errors.comment}</p>
          )}
        </div>
        <input hidden name="bookId" defaultValue={params.id.toString()} />
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
    <Button className="ml-auto block" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Enviando" : "Enviar"}
    </Button>
  );
}
export default FormReview;
