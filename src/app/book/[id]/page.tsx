import Divider from "@/components/divider";
import Header from "@/components/header";
import ReviewCard from "@/app/book/components/review-card";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { BookService } from "@/services/book.service";
import { LikeService } from "@/services/like.service";
import { ReviewService } from "@/services/review.service";
import { getSession } from "@/services/session";
import { Review } from "@/types/Review";
import { truncateString } from "@/utils/truncate-string";
import { Barcode, BookA, BookOpenText, CalendarDays, Hotel, Ruler, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { createBagAction } from "@/actions/bag/create.action";
import { ECoverType } from "@/enums/ECoverType";

const bookService = new BookService();
const reviewService = new ReviewService();
const likeService = new LikeService();

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
      <div className="container-secondary my-6">
        <div className="flex gap-12">
          <div className="flex-1">
            <div className="h-[414px] w-[292px]">
              <Image
                src={book.data.image}
                alt={book.data.title}
                width={440}
                height={480}
                className="h-full"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {book.data.averageRating > 0 ? (
                <p className="text-green-700">Disponivel</p>
              ) : (
                <p className="text-red-700">Indisponivel</p>
              )}
              <form action={createBagAction}>
                <input hidden name="bookId" defaultValue={book.data.id} />
                <Button className="w-full" type="submit" disabled={book.data.averageRating <= 0}>
                  Alugar
                </Button>
              </form>
              <Button variant="secondary">Adicionar aos Favoritos</Button>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Devolução 30 dias após a data de aluguel.</p>
                <p>Sujeito a penalidades em caso de atraso.</p>
                <p>48 horas para a retirada do livro ou o pedido é cancelado automaticamente.</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-[3] flex-grow-[3] basis-0">
            <h1 className="text-2xl font-semibold">
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
            <p className="text-sm leading-relaxed">{book.data.sinopse}</p>
            <Divider />
            <div>
              <p className="mb-6 text-lg">Detalhes do Produto</p>
              <ul className="flex flex-wrap gap-14 text-xs [&>li]:flex [&>li]:flex-col [&>li]:items-center [&>li]:gap-2">
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
                  <span className="font-semibold">ISBN-13</span>
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
        <div className="my-12 h-px bg-slate-300" />
        <section>
          <p className="text-2xl">Livros Relacionados</p>
          <div className="mt-4 flex gap-4">
            {relatedBooks?.data.map((related) => (
              <Link
                className="w-[calc(20%-13px)] space-y-1 rounded"
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
                <p className="h-10 w-fit text-sm font-semibold">
                  {truncateString(related.title, 56)}
                </p>
                <div className="text-xs text-muted-foreground">{related.authorName}</div>
                <div className="flex items-center gap-1 text-sm">
                  {related.averageRating.toFixed(1)} <Star size={14} color="#fb5" fill="#fb5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <div className="my-12 h-px bg-slate-300" />
        <section className="grid grid-cols-[300px_1fr] gap-10">
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
            <p className="pl-4 text-2xl">Principais Avaliações dos usuários</p>
            <div className="mt-6 space-y-6">
              {!reviews?.data.length ? (
                <p className="pl-4">Não há comentários disponíveis.</p>
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
      </div>
    </>
  );
};

export default BookPage;
