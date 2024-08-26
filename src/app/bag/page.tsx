import Header from "@/components/header";
import React from "react";
import BagSection from "./components/bag-section";
import { BagService } from "@/services/bag.service";
import { RentService } from "@/services/rent.service";

const bagService = new BagService();
const rentsService = new RentService();

const RentPage = async () => {
  const bags = await bagService.GetAll();
  const rents = await rentsService.GetAllOfUser("pending");

  let booksRented = rents ? rents.data.reduce((acc, rent) => acc + rent.books.length, 0) : 0;

  return (
    <>
      <Header />
      <div className="container my-6">
        <BagSection bags={bags ? bags.data : null} booksRented={booksRented} />
      </div>
    </>
  );
};

export default RentPage;
