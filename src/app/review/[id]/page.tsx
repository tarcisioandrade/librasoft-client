import Divider from "@/components/divider";
import FormReview from "@/app/review/components/form-review";
import Header from "@/components/header";
import { BookService } from "@/services/book.service";
import { ReviewService } from "@/services/review.service";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateCustomMetadata("Avaliação");

const bookService = new BookService();
const reviewService = new ReviewService();

const ReviewPage = async ({ params }: { params: { id: string } }) => {
  const book = await bookService.GetById(params.id);
  if (!book) notFound();
  const review = await reviewService.Get(book.data.id);
  if (review?.data) redirect(`/book/${book.data.id}`);

  return (
    <>
      <Header />
      <section className="container-third my-6 space-y-6">
        <div className="space-y-12">
          <strong className="text-3xl">Deixe uma avaliação</strong>
          <div className="flex items-center gap-6">
            <Image alt={book.data.title} src={book.data.image} width={40} height={60} />
            <span>{book.data.title}</span>
          </div>
        </div>
        <Divider />
        <FormReview />
      </section>
    </>
  );
};

export default ReviewPage;
