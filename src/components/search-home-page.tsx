"use client";

import React, { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchHomePage = () => {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const route = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentURL = new URL(document.URL);

    if (!value || currentURL.searchParams.has("search")) {
      currentURL.searchParams.delete("search");
    }
    if (currentURL.searchParams.has("category")) {
      currentURL.searchParams.delete("category");
    }
    if (value) {
      currentURL.searchParams.append("search", value);
    }
    setValue("");
    route.push(`/${currentURL.search}`);
  }

  return (
    <form className="flex w-full" onSubmit={handleSearch}>
      <Input
        type="search"
        className="rounded-r-none rounded-br-none focus-visible:ring-0"
        placeholder="Pesquise por título ou autor."
        required
        ref={ref}
        onChange={async ({ target }) => setValue(target.value)}
        value={value}
      />
      <Button
        type="submit"
        className="w-fit cursor-pointer rounded-l-none rounded-bl-none bg-primary hover:bg-primary/90"
      >
        <Search />
      </Button>
    </form>
  );
};

export default SearchHomePage;
