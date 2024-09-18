"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Banner1 from "../../public/banners/programacao-banner.webp";
import Banner2 from "../../public/banners/psicologia-banner.webp";
import Banner3 from "../../public/banners/romance-banner.webp";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const CarouselBanners = () => {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="my-8 hidden lg:block"
    >
      <CarouselContent className="h-[300px]">
        <CarouselItem className="relative">
          <a href="/?category=programação">
            <Image src={Banner1} alt="banner1" className="object-cover" fill />
          </a>
        </CarouselItem>
        <CarouselItem className="relative">
          <a href="/?category=psicologia">
            <Image src={Banner2} alt="banner2" className="object-cover" fill />
          </a>
        </CarouselItem>
        <CarouselItem className="relative">
          <a href="/?category=romance">
            <Image src={Banner3} alt="banner3" className="object-cover" fill />
          </a>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselBanners;
