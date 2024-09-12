"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthorService } from "@/services/author.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Option } from "@/components/ui/multi-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const authorService = new AuthorService();

type Props = {
  value: Option | null;
  onSelect: (value: Option | null) => void;
  onSelected?: (option: Option) => void;
};

export function AuthorSelect({ onSelected, value, onSelect }: Props) {
  const [authors, setAuthors] = React.useState<Option[]>([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const debouncedValue = useDebounce(search);
  const isMounted = React.useRef(false);
  const authorsListWithoutFilter = React.useRef<Option[]>([]);

  async function getAuthorsFn(search?: string) {
    const GET_FROM_API = !authorsListWithoutFilter.current.length || debouncedValue;
    const GET_FROM_REF = authorsListWithoutFilter.current.length && !debouncedValue;

    if (GET_FROM_API) {
      const response = await authorService.getAll(search);
      const authors =
        response?.data.map((author) => ({ label: author.name, value: author.id })) ?? [];
      setAuthors(authors);
      if (!isMounted.current) {
        authorsListWithoutFilter.current = authors;
        isMounted.current = true;
      }
    }
    if (GET_FROM_REF) {
      setAuthors(authorsListWithoutFilter.current);
    }
  }

  React.useEffect(() => {
    getAuthorsFn(debouncedValue);
  }, [debouncedValue]);

  function handlePopover(open: boolean) {
    if (!open) {
      setSearch("");
    }
    setOpen(open);
  }

  function handleSelectAuthor(input: Option) {
    onSelect(input);
    onSelected?.(input);
    setSearch("");
    setOpen(false);
  }

  function handleCreateAndSelect() {
    // Não precisa do value, pois será criado no backend.
    const newAuthor: Option = { label: search, value: "" };
    handleSelectAuthor(newAuthor);
  }

  return (
    <Popover open={open} onOpenChange={handlePopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value?.label}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0">
        <Command>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              className="h-11 border-none bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Proucurar"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandList className={cn({ hidden: !search && !authors.length })}>
            {search ? (
              <CommandEmpty className="h-6 px-2">
                <button
                  type="button"
                  className="mt-1 h-full text-sm"
                  onClick={handleCreateAndSelect}
                >
                  Criar {`"${search}"`}
                </button>
              </CommandEmpty>
            ) : null}
            <CommandGroup>
              {authors.map((author) => (
                <CommandItem
                  key={author.value}
                  value={author.value}
                  onSelect={() => {
                    handleSelectAuthor(author);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.label === author.label ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {author.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {authors.length >= 10 ? (
              <p className="py-2 text-center text-xs text-muted-foreground">
                Pesquise para mais opções.
              </p>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
