import { CategoryService } from "@/services/category.service";
import FormCreateBook from "./components/form-create";

const categoryService = new CategoryService();

const CreateBookPage = async () => {
  const categories = (await categoryService.getAll())?.data ?? [];

  return <FormCreateBook categories={categories} />;
};

export default CreateBookPage;
