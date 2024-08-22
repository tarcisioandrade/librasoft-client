import { BookService } from "@/services/book.service";
import { CategoryService } from "@/services/category.service";
import { notFound } from "next/navigation";
import React from "react";
import FormEditBook from "./components/form-edit";

const bookService = new BookService();
const categoryService = new CategoryService();

const EditBookPage = async ({ params }: { params: { id: string } }) => {
  const book = await bookService.GetById(params.id);
  if (!book) notFound();
  const categories = (await categoryService.getAll()) ?? [];

  return <FormEditBook book={book.data} categories={categories} />;
};

export default EditBookPage;
