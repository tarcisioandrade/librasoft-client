import { CreateBagAction } from "@/actions/create-bag.action";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { BookService } from "@/services/book.service";
import { CategoryService } from "@/services/category.service";
import { truncateString } from "@/utils/truncate-string";
import Image from "next/image";
import Link from "next/link";

const bookService = new BookService();
const categoryService = new CategoryService();

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const queries = {
    category: searchParams.category || null,
    pageNumber: searchParams.pageNumber || "1",
    search: searchParams.search || null,
  };
  const books = await bookService.GetAll(queries);
  const categories = await categoryService.getCategories();
  const hasPreviusPage = books ? books?.currentPage > 1 : false;
  const hasNextPage = books ? books?.currentPage < books.totalPages : false;

  return (
    <>
      <Header />
      <div className="container">
        <div className="my-8 grid h-52 w-full place-items-center bg-blue-500">
          <h4 className="text-9xl text-white">BANNER</h4>
        </div>
        <section className="flex gap-4">
          <aside className="p4 h-[400px] w-56 border p-4">
            <p className="font-semibold uppercase">Categorias</p>
            <ul className="mt-4">
              {categories?.map((categ) => (
                <li key={categ.id}>
                  <Link
                    href={{
                      pathname: "/",
                      query: {
                        category: categ.title.toLowerCase(),
                      },
                    }}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {categ.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="min-h-[1068px] w-full border p-4">
            {!books?.data.length && <p>Nada encontrado.</p>}
            <div className="flex flex-wrap gap-4">
              {books?.data.map((book) => (
                <div
                  key={book.id}
                  className="h-min-[460px] flex w-[calc(20%-13px)] flex-col justify-between rounded bg-secondary p-2"
                >
                  <Link href={`/book/${book.id}`}>
                    <div className="mx-auto h-[260px] w-[180px]">
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={440}
                        height={480}
                        className="h-full"
                      />
                    </div>
                    <h3 className="mt-2 min-h-[40px] text-sm font-semibold tracking-tighter">
                      {truncateString(book.title, 72)}
                    </h3>
                    <div className="space-y-1 py-2">
                      <p className="text-sm font-medium tracking-tighter text-muted-foreground">
                        {book.author.name}
                      </p>
                      <p className="text-xs tracking-tighter text-muted-foreground">
                        Capa Dura
                      </p>
                    </div>
                  </Link>
                  <form action={CreateBagAction}>
                    <input hidden name="bookId" defaultValue={book.id} />
                    <Button
                      className="w-full uppercase"
                      type="submit"
                      disabled={book.averageRating <= 0}
                    >
                      {book.averageRating <= 0 ? "Indisponível" : "Alugar"}
                    </Button>
                  </form>
                </div>
              ))}
            </div>
            <PaginationComponent className="my-12">
              <PaginationContent>
                <PaginationItem
                  className={cn(!hasPreviusPage && "pointer-events-none")}
                >
                  <PaginationPrevious
                    href={{
                      query: {
                        ...queries,
                        pageNumber: books ? books.currentPage - 1 : 1,
                      },
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: books?.totalPages || 1 }).map(
                  (_value, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href={{
                          pathname: "/",
                          query: { ...queries, pageNumber: index + 1 },
                        }}
                        className={cn(
                          books &&
                            books.currentPage === index + 1 &&
                            "pointer-events-none bg-muted-foreground text-white",
                        )}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem
                  className={cn(!hasNextPage && "pointer-events-none")}
                >
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
          </div>
        </section>
      </div>
    </>
  );
}
