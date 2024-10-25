import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ECoverType } from "@/enums/ECoverType";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useBagSectionModel } from "./bag-section.model";

type Props = ReturnType<typeof useBagSectionModel>;

const BagSection = (props: Props) => {
  const {
    calculateReturnDate,
    createRent,
    deleteBag,
    handleBooksAndBagsIdSelected,
    isChecked,
    isDisabled,
    isLoading,
    optismisticBags,
    booksAndBagsIdSelected,
    BUTTON_DISABLED,
  } = props;

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {!optismisticBags?.length ? (
          <div className="grid place-items-center border" data-testid="bag-empty">
            <p className="text-7xl uppercase text-muted-foreground/50">Vazio</p>
          </div>
        ) : (
          <div className="flex flex-col border">
            {optismisticBags?.map((bag, i, array) => (
              <div key={bag.id} className={cn("p-4", array.length !== i + 1 && "border-b")} data-testid="bag-item">
                <div className="relative flex gap-6">
                  <Checkbox
                    name={`book-${bag.book.id}`}
                    checked={isChecked(bag.book.id)}
                    disabled={isDisabled(bag.book.id)}
                    aria-disabled={isDisabled(bag.book.id)}
                    onCheckedChange={(checked) =>
                      handleBooksAndBagsIdSelected(checked, { bookId: bag.book.id, bagId: bag.id })
                    }
                    className="absolute -left-4 self-center lg:static"
                    data-testid={`checkbox-${bag.book.id}`}
                  />
                  <Link href={`/book/${bag.book.id}`} className="h-[150px] w-[110px]">
                    <Image
                      src={bag.book.image}
                      alt={bag.book.title}
                      width={440}
                      height={480}
                      className="h-full"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-1">
                      <Link href={`/book/${bag.book.id}`}>
                        <strong className="line-clamp-3 text-sm font-semibold lg:line-clamp-none lg:text-base">
                          {bag.book.title} -{" "}
                          <span className="font-normal text-muted-foreground">
                            {bag.book.publisher}
                          </span>
                        </strong>
                      </Link>
                      <p className="text-sm lg:block">por {bag.book.authorName}</p>
                      <StarRating
                        size={12}
                        rating={bag.book.averageRating}
                        className="hidden lg:block"
                      />
                      <p className="text-xs text-muted-foreground">
                        {ECoverType[bag.book.coverType]}
                      </p>
                      {bag.book.copiesAvaliable > 0 ? (
                        <p className="text-xs text-green-700">Disponivel</p>
                      ) : (
                        <p className="text-xs text-red-700">Indisponivel</p>
                      )}
                    </div>
                    <form action={deleteBag(bag.id)}>
                      <input hidden name="bagId" defaultValue={bag.id} />
                      <Button
                        variant="link"
                        className="h-fit w-fit p-0 text-xs text-muted-foreground"
                        data-testid="remove-button"
                      >
                        Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex h-[370px] flex-col justify-between border p-4">
          <div className="space-y-4">
            <p data-testid="subtotal-count">
              Subtotal: <strong>{booksAndBagsIdSelected.length} Livro(s)</strong>
            </p>
            <p>
              Data de Devolução:{" "}
              <strong>
                {calculateReturnDate(new Date()).toLocaleDateString("pt-BR", {
                  dateStyle: "long",
                })}
              </strong>
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Sujeito a penalidades em caso de atraso.</p>
              <p>48 horas para a retirada do livro ou o pedido é cancelado automaticamente.</p>
            </div>
          </div>
          <form action={createRent}>
            <Button className="w-full" disabled={BUTTON_DISABLED} aria-disabled={BUTTON_DISABLED} data-testid="submit-button">
              {isLoading ? "Fechando..." : "Fechar Pedido"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BagSection;
