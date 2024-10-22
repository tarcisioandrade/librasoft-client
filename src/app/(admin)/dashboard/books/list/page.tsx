import { BookService } from "@/services/book.service";
import React, { Suspense } from "react";
import DataTable from "./data-table";
import { CategoryService } from "@/services/category.service";
import { filterBooksParamsSchema } from "@/schemas/filterParams.schema";
import TableSkeleton from "./components/table-skeleton";

const bookService = new BookService();
const categoryService = new CategoryService();

const ListPage = async (
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const queries = filterBooksParamsSchema.parse(searchParams);

  const books = bookService.GetAll(queries);
  const categories = categoryService.getAll();

  return (
    <>
      <Suspense fallback={<TableSkeleton />}>
        <DataTable booksPromise={books} categoriesPromise={categories} />
      </Suspense>
    </>
  );
};

export default ListPage;
