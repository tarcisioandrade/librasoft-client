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
import Page from "@/components/page";

export const metadata: Metadata = generateCustomMetadata("Avaliação");

const bookService = new BookService();
const reviewService = new ReviewService();

const ReviewPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const book = await bookService.GetById(params.id);
  if (!book) notFound();
  const review = await reviewService.Get(book.data.id);
  if (review?.data) redirect(`/book/${book.data.id}`);

  return (
    <>
      <Header />
      <Page className="space-y-6 lg:my-6" container="container-third" asChild>
        <section>
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
      </Page>
    </>
  );
};

export default ReviewPage;
