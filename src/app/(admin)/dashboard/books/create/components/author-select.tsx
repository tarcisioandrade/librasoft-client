"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthorService } from "@/services/author.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { CommandLoading } from "cmdk";
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
  onSelected?: (option: Option) => void;
  value: Option | null;
};

export function AuthorSelect({ onSelected, value }: Props) {
  const [authors, setAuthors] = React.useState<Option[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option | null>(value);
  const [search, setSearch] = React.useState("");
  const [isLoading, startTransition] = React.useTransition();

  const debouncedValue = useDebounce(search);

  function getAuthorsFn(search?: string) {
    startTransition(async () => {
      const authors = await authorService.getAll(search);
      const authorsFormated =
        authors?.data.map((author) => ({ label: author.name, value: author.id })) ?? [];
      setAuthors(authorsFormated);
    });
  }

  React.useEffect(() => {
    getAuthorsFn(debouncedValue);
  }, [debouncedValue]);

  function handlePopover(open: boolean) {
    if (open === true) setSearch("");
    setOpen(open);
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
          {selected ? selected.label : null}
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
          <CommandList>
            <CommandEmpty>Nenhum autor encontrado</CommandEmpty>
            {isLoading ? (
              <CommandLoading className="py-6 text-center text-sm">Proucurando...</CommandLoading>
            ) : (
              <CommandGroup>
                {authors.map((author) => (
                  <CommandItem
                    key={author.value}
                    value={author.value}
                    onSelect={() => {
                      setSelected(author);
                      onSelected?.(author);
                      setSearch("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.label === author.label ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {author.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
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
