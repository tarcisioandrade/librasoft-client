import { ECoverType } from "@/enums/ECoverType";
import { ERentStatus } from "@/enums/ERentStatus";
import { formatDate } from "@/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import RentTableRowActions from "./components/table-row-actions";
import { Constants } from "@/constants";

export type RentsColumns = {
  id: string;
  rentDate: string;
  expectedReturnDate: string;
  returnedDate: string | null;
  status: keyof typeof ERentStatus;
  books: {
    id: string;
    title: string;
    image: string;
    averageRating: number;
    coverType: keyof typeof ECoverType;
    publisher: string;
    author: {
      name: string;
    };
  }[];
  user_email: string;
};

const getRentColumns = (): ColumnDef<RentsColumns>[] => {
  return [
    {
      accessorKey: "user_email",
      header: "E-mail",
    },
    {
      accessorKey: "rentDate",
      header: "Solicitação",

      cell: ({ row }) => <div>{formatDate(row.original.rentDate, { dateStyle: "short" })}</div>,
    },
    {
      accessorKey: "expectedReturnDate",
      header: "Retorno Esperado",
      cell: ({ row }) => (
        <div>{formatDate(row.original.expectedReturnDate, { dateStyle: "short" })}</div>
      ),
    },
    {
      accessorKey: "returnedDate",
      header: "Retorno",
      cell: ({ row }) => (
        <div>
          {row.original.returnedDate
            ? formatDate(row.original.expectedReturnDate, { dateStyle: "short" })
            : "---"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <strong className="text-sm" style={{ color: Constants.STATUS_COLOR[row.original.status] }}>
          {ERentStatus[row.original.status]}
        </strong>
      ),
    },
    {
      accessorKey: "books",
      header: "Livros",
      cell: ({ row }) => {
        const books = row.original.books;
        return (
          <div className="flex items-center">
            {books.map((b, i) => (
              <div
                className={`-translate-x-${i * 2} overflow-hidden rounded-md border-[2.5px] border-white`}
                key={b.id}
              >
                <Image
                  src={b.image}
                  height={46}
                  width={32}
                  alt={b.title}
                  style={{ aspectRatio: 32 / 46 }}
                />
              </div>
            ))}
          </div>
        );
      },
    },
    { id: "actions", cell: ({ row }) => <RentTableRowActions row={row} /> },
  ];
};

export default getRentColumns;
