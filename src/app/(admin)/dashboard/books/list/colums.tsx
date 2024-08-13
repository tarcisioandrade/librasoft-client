"use client";

import { EStatusType } from "@/enums/EStatusType";
import { Category } from "@/types/Category";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BookColumns = {
  id: string;
  image: string;
  categories: Category[];
  copiesAvaliable: number;
  title: string;
  status: keyof typeof EStatusType;
};

const getColumns = (): ColumnDef<BookColumns>[] => {
  return [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const src = String(row.getValue("image"));
        return (
          <Image
            src={src}
            width={34}
            height={54}
            alt={`${row.getValue("title")}`}
            className="object-cover"
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }) => {
        const categories: Category[] = row.getValue("categories");
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge className="pointer-events-none bg-muted text-primary" key={c.id}>
                {c.title}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "copiesAvaliable",
      header: "Cópias",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <strong
          className={cn(
            "font-semibold text-green-500",
            row.original.status === "Inactive" && "text-red-500",
          )}
        >
          {EStatusType[row.original.status]}
        </strong>
      ),
    },
    {
      accessorKey: "authorName",
      header: "Autor",
    },
  ];
};

export default getColumns;
