"use client";

import { Category } from "@/types/Category";
import React from "react";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type Props = {
  categories: Category[];
};

const MenuCategories = ({ categories }: Props) => {
  const SLICE_COUNT = 8;
  const MORE_CATEGORIES = categories.slice(SLICE_COUNT);

  return (
    <div className="border-b">
      <div className="container h-10">
        <ul className="flex h-full items-center justify-center gap-6">
          {categories.slice(0, SLICE_COUNT).map((categ) => (
            <li className="text-sm" key={categ.id}>
              <a
                className="select-none hover:underline"
                href={`/?category=${categ.title.toLowerCase()}`}
              >
                {categ.title}
              </a>
            </li>
          ))}
          {MORE_CATEGORIES.length ? (
            <li className="-ml-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger asChild>
                      <div className="flex select-none items-center gap-1 font-semibold">
                        <Menu />
                        Mais Categorias
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] grid-cols-2 p-2">
                        {MORE_CATEGORIES.map((categ) => (
                          <li className="text-sm" key={categ.id}>
                            <NavigationMenuLink asChild>
                              <a
                                href={`/?category=${categ.title.toLowerCase()}`}
                                className="block select-none whitespace-nowrap p-2 hover:underline"
                              >
                                {categ.title}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default MenuCategories;
