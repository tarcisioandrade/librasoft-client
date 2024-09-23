import Divider from "@/components/divider";
import Header from "@/components/header";
import ReviewCard from "@/app/book/[id]/components/review-card";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { BookService } from "@/services/book.service";
import { LikeService } from "@/services/like.service";
import { ReviewService } from "@/services/review.service";
import { getSession } from "@/services/session.service";
import { Review } from "@/types/Review";
import { Barcode, BookA, BookOpenText, CalendarDays, Hotel, Ruler, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { ECoverType } from "@/enums/ECoverType";
import SinopseWrapper from "./components/sinopse-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import { generateCustomMetadata } from "@/utils/generate-custom-metadata";
import dynamic from "next/dynamic";
import Page from "@/components/page";

const FormRentDynamic = dynamic(() => import("./components/form-rent"));

const bookService = new BookService();
const reviewService = new ReviewService();
const likeService = new LikeService();

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const book = await bookService.GetById(params.id);
  return generateCustomMetadata(book?.data.title);
};

const BookPage = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  const book = await bookService.GetById(params.id);

  if (!book) return notFound();

  const relatedBooks = await bookService.GetRelated(params.id);
  const reviews = await reviewService.GetAll(book.data.id);
  let reviewUser: Review | null = null;
  if (session) {
    const review = await reviewService.Get(book.data.id);
    if (review?.data) reviewUser = review.data;
  }

  return (
    <>
      <Header />
      <Page container="container-secondary">
        <Breadcrumb className="my-4">
          <BreadcrumbList className="sm:gap-1">
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-xs">
                  Página Inicial
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
            {book.data.categories.map((c, i, array) => (
              <React.Fragment key={c.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/?category=${c.title.toLowerCase()}`} className="text-xs">
                    {c.title}
                    {i + 1 !== array.length ? ", " : null}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex-1">
            <div className="mx-auto h-[414px] w-[292px]">
              <Image
                src={book.data.image}
                alt={book.data.title}
                width={440}
                height={480}
                className="h-full"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {book.data.copiesAvaliable > 0 ? (
                <p className="text-green-700">Disponivel</p>
              ) : (
                <p className="text-red-700">Indisponivel</p>
              )}
              <FormRentDynamic book={book.data} />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Devolução 30 dias após a data de aluguel.</p>
                <p>Sujeito a penalidades em caso de atraso.</p>
                <p>48 horas para a retirada do livro ou o pedido é cancelado automaticamente.</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-[3] flex-grow-[3] basis-0">
            <h1 className="font-semibold md:text-2xl">
              {book.data.title}{" "}
              <span className="font-normal text-muted-foreground">
                {ECoverType[book.data.coverType]} -{" "}
              </span>
              <span className="font-normal text-muted-foreground">
                {new Date(book.data.publicationAt).toLocaleDateString("pt-BR", {
                  dateStyle: "long",
                })}
              </span>
            </h1>
            <div className="flex gap-2 text-sm">
              <span>Edição Português</span> |{" "}
              <span className="text-muted-foreground">por {book.data.author.name}</span>
            </div>
            <StarRating size={12} rating={book.data.averageRating} />
            <Divider />
            <SinopseWrapper text={book.data.sinopse} />
            <Divider />
            <div>
              <p className="mb-6 text-lg">Detalhes do Produto</p>
              <div className="overflow-x-auto">
                <ul className="flex w-[700px] text-xs lg:w-full lg:flex-wrap lg:gap-12 [&>li:nth-child(odd)]:border-x lg:[&>li:nth-child(odd)]:border-none [&>li]:flex [&>li]:w-[14.28%] [&>li]:flex-col [&>li]:items-center [&>li]:gap-2 [&>li]:text-center lg:[&>li]:w-fit">
                  <li>
                    <span className="font-semibold">Editora</span>
                    <Hotel />
                    {book.data.publisher}
                  </li>
                  <li className="capitalize">
                    <span className="font-semibold">Idioma</span>
                    <BookA />
                    {book.data.language}
                  </li>
                  <li>
                    <span className="font-semibold">Numero de Páginas</span>
                    <BookOpenText />
                    {book.data.pageCount} páginas
                  </li>
                  <li>
                    <span className="font-semibold">ISBN-10</span>
                    <Barcode />
                    {book.data.isbn}
                  </li>
                  <li>
                    <span className="font-semibold">Dimensões</span>
                    <Ruler />
                    {`${book.data.dimensions.width} x ${book.data.dimensions.height} x ${book.data.dimensions.depth} cm`}
                  </li>
                  <li>
                    <span className="font-semibold">Avaliação</span>
                    <Star color="#fb5" fill="#fb5" />
                    {book.data.averageRating.toFixed(1)}
                  </li>
                  <li>
                    <span className="font-semibold">Data da Publicação</span>
                    <CalendarDays />
                    {new Date(book.data.publicationAt).toLocaleDateString("pt-BR", {
                      dateStyle: "long",
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="my-12 h-px bg-slate-300" />
        <section>
          <p className="text-2xl">Livros Relacionados</p>
          <div className="mt-4 flex gap-4 overflow-x-auto">
            {relatedBooks?.data.map((related) => (
              <Link
                className="space-y-1 rounded lg:w-[calc(20%-13px)]"
                href={`/book/${related.id}`}
                key={related.id}
              >
                <div className="h-[284px] w-52 rounded bg-muted">
                  <Image
                    src={related.image}
                    width={215}
                    height={284}
                    alt={related.title}
                    className="h-full"
                  />
                </div>
                <p className="line-clamp-3 w-fit text-sm font-semibold">{related.title}</p>
                <div className="text-xs text-muted-foreground">{related.authorName}</div>
                <div className="flex items-center gap-1 text-sm">
                  {related.averageRating.toFixed(1)} <Star size={14} color="#fb5" fill="#fb5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <div className="my-12 h-px bg-slate-300" />
        <section className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="text-2xl">Avaliações dos usuários</p>
            <div className="mt-6 space-y-2 text-sm">
              <strong className="text-2xl text-primary">
                {book.data.averageRating.toFixed(1)}/5.0
              </strong>
              <p className="text-muted-foreground">{book.data.reviewsCount} avaliações</p>
              <StarRating hiddenRatingNumber rating={book.data.averageRating} />
            </div>
            <div className="my-4 h-px bg-slate-300" />
            <div className="space-y-2 text-sm">
              <strong>Avalie este produto</strong>
              <p>Compartilhe seus pensamentos com outros clientes</p>
              {reviewUser ? (
                <p className="text-sm text-green-700">Você já avaliou este produto.</p>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`/review/${book.data.id}`}>Escreva uma avaliação</Link>
                </Button>
              )}
            </div>
          </div>
          <div>
            {reviewUser && (
              <ReviewCard
                review={reviewUser}
                currentUserReviewId={reviewUser.id}
                authenticate={!!session}
                className="mb-4 rounded bg-muted"
              />
            )}
            <p className="text-2xl lg:pl-4">Principais Avaliações dos usuários</p>
            <div className="mt-4 lg:mt-6 lg:space-y-6">
              {!reviews?.data.length ? (
                <p className="lg:pl-4">Não há comentários disponíveis.</p>
              ) : (
                reviews.data
                  .filter((review) => (reviewUser ? reviewUser.id !== review.id : review))
                  .map(async (review) => {
                    const isLiked = session ? await likeService.Get(review.id) : false;

                    return (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        currentUserReviewId={reviewUser?.id}
                        isLiked={isLiked}
                        authenticate={!!session}
                      />
                    );
                  })
              )}
            </div>
            {reviews && reviews.totalPages > 1 && (
              <Link
                href={{
                  pathname: `/book/${book.data.id}/book-review`,
                  query: {
                    pageNumber: 1,
                  },
                }}
                className="mt-6 block pl-4 text-sm text-blue-700"
              >
                Ver mais avaliações →
              </Link>
            )}
          </div>
        </section>
      </Page>
    </>
  );
};

export default BookPage;
