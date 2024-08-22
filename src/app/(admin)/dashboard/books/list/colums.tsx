"use client";

import { EStatusType } from "@/enums/EStatusType";
import { Category } from "@/types/Category";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TableRowActions from "../components/table-row-actions";
import StarRating from "@/components/star-rating";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type BookColumns = {
  id: string;
  image: string;
  categories: Category[];
  copiesAvaliable: number;
  title: string;
  averageRating: number;
  status: keyof typeof EStatusType;
};

const getColumns = (): ColumnDef<BookColumns>[] => {
  return [
    {
      accessorKey: "image",
      header: "#",
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
      cell: ({ row }) => (
        <div className="flex w-[600px] items-center gap-1">
          <span className="line-clamp-1">{row.original.title}</span>
          <Button className="px-1" variant="link" asChild>
            <Link href={`/book/${row.original.id}`} target="_blank">
              <ExternalLink className="text-blue-800" size={14} />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "averageRating",
      header: "Classificação",
      cell: ({ row }) => (
        <StarRating rating={row.original.averageRating} size={14} totalStars={1} />
      ),
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }) => {
        const categories: Category[] = row.getValue("categories");
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge
                className="pointer-events-none rounded-md bg-secondary text-primary"
                key={c.id}
              >
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
    { id: "actions", cell: ({ row }) => <TableRowActions row={row} /> },
  ];
};

export default getColumns;
