import Header from "@/components/header";
import { ECoverType } from "@/enums/ECoverType";
import { cn } from "@/lib/utils";
import { BookService } from "@/services/book.service";
import { CategoryService } from "@/services/category.service";
import Image from "next/image";
import StarRating from "@/components/star-rating";
import { FilterBooksParams } from "@/schemas/filterParams.schema";
import LibraryRules from "@/components/library-rules";
import MenuCategories from "@/components/menu-categories";
import CarouselBanners from "@/components/carousel-banners";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

const bookService = new BookService();
const categoryService = new CategoryService();

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const queries: FilterBooksParams = {
    categories: searchParams.category,
    pageNumber: searchParams.pageNumber || "1",
    title: searchParams.search,
    pageSize: searchParams.pageSize || "10",
  };

  const books = await bookService.GetAll(queries);
  const categories = await categoryService.getAll();
  const hasPreviusPage = books ? books.currentPage > 1 : false;
  const hasNextPage = books ? books.currentPage < books.totalPages : false;
  const { pageSize, ...QUERIES_WITHOUT_PAGE_SIZE_TO_PAGINATION_LINKS } = queries;
  const CATEGORY_FILTERED = categories?.data.find(
    (c) => c.title.toLowerCase() === queries.categories,
  );

  return (
    <>
      <div className="bg-primary text-white">
        <div className="container flex h-9 items-center justify-between text-xs">
          <p>Alugue aqui livros de milhares de sebos e livrarias.</p>
          <ul>
            <li>
              <a href="/">Central de Ajuda</a>
            </li>
          </ul>
        </div>
      </div>
      <Header />
      <MenuCategories categories={categories?.data || []} />
      <div className="container">
        {!queries.categories ? <CarouselBanners /> : null}
        <section className="flex gap-4">
          <div className={cn({ "mt-8": queries.categories })}>
            {queries.categories ? (
              <p className="-mt-5 h-5 text-sm">
                {books.totalCount}-10 de mais de {books.totalCount} resultados para{" "}
                <span className="text-green-500">{CATEGORY_FILTERED?.title}</span>
              </p>
            ) : null}
            {queries.title ? (
              <p className="-mt-5 h-5 text-sm">
                {books.totalCount}-10 de mais de {books.totalCount} resultados para{" "}
                <span className="text-green-500">{queries.title}</span>
              </p>
            ) : null}
            <div className="border p-4">
              {!books?.data.length ? <p>Nada encontrado.</p> : null}
              <div className="flex flex-wrap gap-4">
                {books?.data.map((book) => (
                  <div
                    key={book.id}
                    className="h-min-[460px] flex w-[calc(20%-13px)] flex-col justify-between rounded bg-secondary/30 p-2"
                  >
                    <a href={`/book/${book.id}`}>
                      <div className="mx-auto h-[260px] w-[180px]">
                        <Image
                          src={book.image}
                          alt={book.title}
                          width={440}
                          height={480}
                          className="h-full"
                        />
                      </div>
                      <h3 className="mt-2 truncate text-sm font-semibold tracking-tighter">
                        {book.title}
                      </h3>
                      <div className="space-y-1 py-2">
                        <p className="text-sm font-medium tracking-tighter text-muted-foreground">
                          {book.author.name}
                        </p>
                        <p className="text-xs tracking-tighter text-muted-foreground">
                          {ECoverType[book.coverType]}
                        </p>
                      </div>
                      <StarRating rating={book.averageRating} size={12} />
                    </a>
                  </div>
                ))}
              </div>
              {books.totalPages > 1 ? (
                <PaginationComponent className="my-12">
                  <PaginationContent>
                    <PaginationItem className={cn(!hasPreviusPage && "pointer-events-none")}>
                      <PaginationPrevious
                        href={{
                          query: {
                            ...QUERIES_WITHOUT_PAGE_SIZE_TO_PAGINATION_LINKS,
                            pageNumber: books ? books.currentPage - 1 : 1,
                          },
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: books?.totalPages || 1 }).map((_value, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href={{
                            pathname: "/",
                            query: {
                              ...QUERIES_WITHOUT_PAGE_SIZE_TO_PAGINATION_LINKS,
                              pageNumber: index + 1,
                            },
                          }}
                          className={cn(
                            books &&
                              books.currentPage === index + 1 &&
                              "pointer-events-none bg-primary text-white",
                          )}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={cn(!hasNextPage && "pointer-events-none")}>
                      <PaginationNext
                        href={{
                          query: {
                            ...queries,
                            pageNumber: books ? books.currentPage + 1 : 1,
                          },
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </PaginationComponent>
              ) : null}
            </div>
            <LibraryRules />
          </div>
        </section>
      </div>
    </>
  );
}
