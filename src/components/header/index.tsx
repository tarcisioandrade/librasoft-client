import React from "react";
import { headers } from "next/headers";
import { getSession } from "@/services/session.service";
import { BagService } from "@/services/bag.service";
import { CategoryService } from "@/services/category.service";
import { HeaderProps } from "@/types/Header";
import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

const categoryService = new CategoryService();

const Header = async () => {
  const session = await getSession();
  const callbackUrl = headers().get("x-current-path");
  const categories = (await categoryService.getAll())?.data || [];
  let bagCount: number | null = null;
  let IS_PROFILE_COMPLETE = false;
  if (session) {
    const bagService = new BagService();
    bagCount = (await bagService.GetAll())?.data.length ?? 0;
    IS_PROFILE_COMPLETE = !!session.user.address;
  }

  const options: HeaderProps = {
    session,
    bagCount,
    callbackUrl,
    categories,
    profileStatus: IS_PROFILE_COMPLETE,
  };

  return (
    <header>
      <DesktopHeader {...options} />
      <MobileHeader {...options} />
    </header>
  );
};

export default Header;
