"use client";

import { cn } from "@/lib/utils";
import { Review } from "@/types/Review";
import { User } from "lucide-react";
import { ComponentProps, useOptimistic } from "react";
import { Button } from "../../../../components/ui/button";
import { createLike } from "@/actions/like/create.action";
import { deleteLike } from "@/actions/like/delete.action";
import { useRouter } from "next/navigation";
import StarRating from "../../../../components/star-rating";

type Props = {
  review: Review;
  authenticate: boolean;
  currentUserReviewId?: string;
  isLiked?: boolean;
} & ComponentProps<"div">;

type OptmisticLikeCountAction = "increment" | "decrement";

const ReviewCard = ({
  review,
  authenticate,
  currentUserReviewId,
  className,
  isLiked,
  ...rest
}: Props) => {
  const [optmisticLikesCount, addOptimisticLikesCount] = useOptimistic(
    review.likesCount,
    (state, action: OptmisticLikeCountAction) => {
      if (action === "increment") return state + 1;
      if (action === "decrement") return state - 1;
      return state;
    },
  );
  const router = useRouter();
  const pushToLoginPage = () => router.push("/signin");

  async function formCreateLikeAction(formData: FormData) {
    if (!authenticate) return pushToLoginPage();
    addOptimisticLikesCount("increment");
    await createLike(formData);
  }

  async function formDeleteLikeAction(formData: FormData) {
    if (!authenticate) return pushToLoginPage();
    addOptimisticLikesCount("decrement");
    await deleteLike(formData);
  }

  return (
    <div key={review.id} {...rest} className={cn(className, "p-4")}>
      <header className="space-y-2 text-sm">
        <span className="flex items-center gap-2 text-xs">
          <div className="grid h-8 w-8 place-content-center rounded-full bg-secondary">
            <User className="text-muted-foreground" />
          </div>
          {review.author}
        </span>
        <div className="flex items-center gap-1">
          <StarRating hiddenRatingNumber rating={review.rating} size={14} />
          <strong>{review.title}</strong>
        </div>
        <div className="text-muted-foreground">
          Avaliado em{" "}
          {new Date(review.createdAt).toLocaleDateString("pt-BR", {
            dateStyle: "long",
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {optmisticLikesCount} {optmisticLikesCount > 1 ? "Avaliações" : "Avaliação"}
        </p>
      </header>
      <div className="mt-4 space-y-2 whitespace-pre-wrap text-sm">
        <p>{review.comment}</p>
      </div>
      {currentUserReviewId === review.id ? (
        <p className="mt-2 text-sm text-green-700">Obrigado pela avaliação!</p>
      ) : (
        <div className="flex items-center gap-4">
          <form action={isLiked ? formDeleteLikeAction : formCreateLikeAction}>
            <input name="reviewId" hidden defaultValue={review.id} />
            <Button type="submit" variant="outline" className={cn("mt-2", isLiked && "bg-muted")}>
              Útil
            </Button>
          </form>

          <Button variant="link" className="mt-2">
            Denunciar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
