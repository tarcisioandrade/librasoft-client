import Header from "@/components/header";
import ReviewCard from "@/app/book/[id]/components/review-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LikeService } from "@/services/like.service";
import { ReviewService } from "@/services/review.service";
import { getSession } from "@/services/session";
import Link from "next/link";
import React from "react";

const reviewService = new ReviewService();
const likeService = new LikeService();

const ReviewBookPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) => {
  const session = await getSession();
  const reviews = await reviewService.GetAll(params.id, Number(searchParams.pageNumber));

  return (
    <>
      <Header />
      <div className="container-secondary">
        {reviews?.data.map(async (review) => {
          const isLiked = session ? await likeService.Get(review.id) : false;
          return (
            <ReviewCard
              key={review.id}
              review={review}
              isLiked={isLiked}
              authenticate={!!session}
            />
          );
        })}
        {reviews && reviews.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              asChild
              disabled={!reviews.hasPreviousPage}
              aria-disabled={!reviews.hasPreviousPage}
              className={cn(!reviews.hasPreviousPage, "pointer-events-none opacity-50")}
              variant="secondary"
            >
              <Link href={{ query: { pageNumber: reviews.currentPage - 1 } }}>Anterior</Link>
            </Button>
            <Button
              asChild
              disabled={!reviews.hasNextPage}
              aria-disabled={!reviews.hasNextPage}
              className={cn(!reviews.hasNextPage, "pointer-events-none opacity-50")}
            >
              <Link href={{ query: { pageNumber: reviews.currentPage + 1 } }}>Próxima</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewBookPage;
