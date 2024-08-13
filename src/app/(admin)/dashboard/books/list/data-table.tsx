"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { Book } from "@/types/Book";
import { DataTableFilterField } from "@/types/DataTableFilterOptions";
import { Pagination } from "@/types/Pagination";
import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Category } from "@/types/Category";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import getColumns, { BookColumns } from "./colums";
import { DataTableToolbar } from "../components/table-toolbar";
import { DataTablePagination } from "../components/table-pagination";

type Props = {
  booksPromise: Promise<Pagination<Book>>;
  categoriesPromise: Promise<Category[] | null>;
};

const DataTable = ({ booksPromise, categoriesPromise }: Props) => {
  const { data, totalPages } = React.use(booksPromise);
  const categories = React.use(categoriesPromise);

  const filterFields: DataTableFilterField<BookColumns>[] = [
    {
      label: "Search",
      value: "title",
      placeholder: "Filtrar por títulos ou autor...",
    },
    {
      label: "Categorias",
      value: "categories",
      options: categories?.map((categ) => ({
        label: categ.title[0]?.toUpperCase() + categ.title.slice(1),
        value: categ.title,
        withCount: true,
      })),
    },
  ];

  const columns = React.useMemo(() => getColumns(), []);

  const books =
    data.map(({ id, title, image, status, categories, copiesAvaliable, author }) => ({
      id,
      title,
      image,
      status,
      categories,
      copiesAvaliable,
      authorName: author.name,
    })) ?? [];

  const { table } = useDataTable({
    data: books,
    columns,
    pageCount: totalPages,
    /* optional props */
    filterFields,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 1,
      },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <>
      <DataTableToolbar table={table} filterFields={filterFields} />
      <div className="mt-2 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
    </>
  );
};

export default DataTable;
