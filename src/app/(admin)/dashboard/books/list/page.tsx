import { BookService } from "@/services/book.service";
import React, { Suspense } from "react";
import DataTable from "./data-table";
import { CategoryService } from "@/services/category.service";
import { filterParamsSchema } from "@/schemas/filterParams.schema";
import TableSkeleton from "../components/table-skeleton";

const bookService = new BookService();
const categoryService = new CategoryService();

const ListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const queries = filterParamsSchema.parse(searchParams);

  const books = bookService.GetAll(queries);
  const categories = categoryService.getCategories();

  return (
    <div className="pb-20">
      <Suspense fallback={<TableSkeleton />}>
        <DataTable booksPromise={books} categoriesPromise={categories} />
      </Suspense>
    </div>
  );
};

export default ListPage;
