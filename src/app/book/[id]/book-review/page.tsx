import Header from "@/components/header";
import ReviewCard from "@/app/book/[id]/components/review-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LikeService } from "@/services/like.service";
import { ReviewService } from "@/services/review.service";
import { getSession } from "@/services/session.service";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import Page from "@/components/page";

export const metadata: Metadata = generateCustomMetadata("Avaliações");

const reviewService = new ReviewService();
const likeService = new LikeService();

const ReviewBookPage = async (
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const session = await getSession();
  const reviews = await reviewService.GetAll(params.id, Number(searchParams.pageNumber));

  return (
    <>
      <Header />
      <Page container="container-secondary">
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
      </Page>
    </>
  );
};

export default ReviewBookPage;
