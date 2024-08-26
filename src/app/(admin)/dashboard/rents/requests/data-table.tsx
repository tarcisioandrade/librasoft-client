"use client";

import { DataTableFilterField } from "@/types/DataTableFilterOptions";
import { Pagination } from "@/types/Pagination";
import { Rent } from "@/types/Rent";
import React, { use } from "react";
import getRentColumns, { RentsColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { DataTableToolbar } from "../../components/table/table-toolbar";
import { DataTablePagination } from "../../components/table/table-pagination";
import { ERentStatus } from "@/enums/ERentStatus";

type Props = {
  rentsPromise: Promise<Pagination<Rent>>;
};

const rentStatusEntries = Object.entries(ERentStatus);
const statusFilterOptions = rentStatusEntries.map(([key, value]) => ({
  label: value,
  value: key,
}));

const RentDataTable = ({ rentsPromise }: Props) => {
  const { data, totalPages } = use(rentsPromise);

  const filterFields: DataTableFilterField<RentsColumns>[] = [
    {
      label: "Search",
      value: "user_email",
      placeholder: "Pesquisar por e-mail...",
    },
    {
      label: "Status",
      value: "status",
      options: statusFilterOptions?.map((status) => ({
        label: status.label,
        value: status.value,
        uniqueSelect: true,
        hiddenSearchInput: true,
      })),
    },
  ];

  const columns = React.useMemo(() => getRentColumns(), []);

  const rents: RentsColumns[] =
    data.map((d) => ({
      id: d.id,
      books: d.books,
      user_email: d.user.email,
      expectedReturnDate: d.expectedReturnDate,
      rentDate: d.rentDate,
      returnedDate: d.returnedDate,
      status: d.status,
    })) ?? [];

  const { table } = useDataTable({
    data: rents,
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

  const headerTranslate: Partial<Record<keyof RentsColumns, string>> = {
    rentDate: "Solicitação",
    user_email: "Email",
    expectedReturnDate: "Retorno Esperado",
    returnedDate: "Retorno",
    books: "Livros",
    status: "Status",
  };

  return (
    <>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        toolbarViewOptionsLabel={headerTranslate}
      />
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

export default RentDataTable;
