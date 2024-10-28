import { Author } from "@/types/Author";
import { Bag } from "@/types/Bag";
import { Book } from "@/types/Book";
import { Category } from "@/types/Category";
import { Rent } from "@/types/Rent";
import { User } from "@/types/User";

export const MockUser: User = {
  id: "USR002",
  name: "Maria Silva",
  email: "maria.silva@example.com",
  telephone: "11987654321",
  address: {
    street: "Rua Principal",
    city: "São Paulo",
    state: "SP",
    district: "Centro",
    zipCode: "02803917",
  },
  role: "Common",
  status: "Active",
};

export const MockAuthor: Author = {
  id: "01",
  biography: "abc",
  dateBirth: new Date().toISOString(),
  name: "Author",
  status: "Active",
};

export const MockCategory: Category = {
  id: "01",
  title: "Aventura",
};

export const MockBook: Book = {
  id: "BK003",
  title: "O Senhor dos Anéis",
  publisher: "Editora Abril",
  image: "(link unavailable)",
  isbn: "978-85-356-1245-6",
  publicationAt: new Date().toISOString(),
  pageCount: 432,
  sinopse: "Uma aventura épica na Terra Média...",
  language: "Português",
  dimensions: {
    width: 15,
    height: 21,
    depth: 3,
  },
  coverType: "Hardcover",
  copiesAvaliable: 5,
  averageRating: 4.8,
  reviewsCount: 120,
  status: "Active",
  createdAt: new Date().toISOString(),
  categories: [MockCategory],
  author: MockAuthor,
};

export const MockRent: Rent = {
  id: "REN001",
  rentDate: new Date().toISOString(),
  expectedReturnDate: new Date().toISOString(),
  returnedDate: null,
  status: "Rent_Expired",
  books: [
    {
      id: "BOOK002",
      author: { name: "opa" },
      averageRating: 1.0,
      coverType: "Hardcover",
      image: "https://m.media-amazon.com/images/I/41aHzYSXZkL._SY445_SX342_.jpg",
      publisher: "Alta",
      title: "Mágico",
    },
  ],
  user: {
    id: MockUser.id,
    name: MockUser.name,
    email: MockUser.email,
  },
};

export const MockBag: Bag = {
  id: "BAG01",
  book: {
    title: "BOOK03",
    averageRating: 1.0,
    copiesAvaliable: 60,
    coverType: "Hardcover",
    authorName: "Author",
    id: "BOOK04",
    image: "https://m.media-amazon.com/images/I/41aHzYSXZkL._SY445_SX342_.jpg",
    publisher: "pub",
    status: "Active",
  },
  createdAt: new Date().toISOString(),
};
