import Header from "@/components/header";
import React from "react";
import BagSection from "./components/bag-section";
import { BagService } from "@/services/bag.service";

const bagService = new BagService();

const RentPage = async () => {
  const bags = await bagService.GetAll();

  return (
    <>
      <Header />
      <div className="container my-6">
        <BagSection bags={bags ? bags.data : null} />
      </div>
    </>
  );
};

export default RentPage;
