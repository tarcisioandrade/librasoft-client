import { redirect } from "next/navigation";

const InitPage = () => {
  return redirect("/dashboard/books/list");
};

export default InitPage;
