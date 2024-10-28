"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Category } from "@/types/Category";
import { ECoverType } from "@/enums/ECoverType";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDebounce } from "@/hooks/use-debounce";
import { Image as ImageIcon } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Book } from "@/types/Book";
import { AuthorSelect } from "@/app/(admin)/dashboard/components/author-select";
import { useParams } from "next/navigation";
import { editBookFormSchema, EditBookFormType } from "@/schemas/edit-book.schema";
import { editBookAction } from "@/actions/book/edit.action";
import ErrorMessage from "@/components/ui/error-message";

type Props = {
  categories: Category[];
  book: Book;
};

type AuthorError = {
  author?: {
    message: string;
  };
};

const FormEditBook = ({ categories, book }: Props) => {
  const [categoriesSelected, setCategoriesSelected] = useState<Option[]>(
    book.categories.map((c) => ({ label: c.title, value: c.id })),
  );
  const [authorSelected, setAuthorSelected] = useState<Option | null>({
    label: book.author.name,
    value: book.author.id,
  });
  const [authorError, setAuthorError] = useState<AuthorError | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const params = useParams<{ id: string }>();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
  } = useForm<EditBookFormType>({
    resolver: zodResolver(editBookFormSchema),
    defaultValues: {
      id: params.id,
      depth: String(book.dimensions.depth),
      height: String(book.dimensions.height),
      image: book.image,
      isbn: book.isbn,
      publicationAt: new Date(book.publicationAt).toISOString().split("T")[0],
      publisher: book.publisher,
      sinopse: book.sinopse,
      title: book.title,
      width: String(book.dimensions.width),
      copiesAvailable: String(book.copiesAvaliable),
      pageCount: String(book.pageCount),
      coverType: book.coverType,
      language: book.language,
    },
  });

  const categoriesOptions: Option[] = useMemo(
    () =>
      categories.map((categ) => ({
        label: categ.title,
        value: categ.title,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const coverTypeEntries = Object.entries(ECoverType);

  function submitFn(input: EditBookFormType) {
    if (imageError) {
      setError("image", { message: "Verifique a URL da imagem." });
      return;
    }

    if (!authorSelected) {
      setAuthorError({ author: { message: "Preencha este campo." } });
      return;
    }

    const formData = new FormData();
    const entries = Object.entries(input);
    entries.forEach(([key, value]) => formData.append(key, String(value)));
    const categoriesParsed = categoriesSelected?.map(({ _, label }) => ({
      title: label,
    }));

    formData.append("categories", JSON.stringify(categoriesParsed));
    formData.append(
      "author",
      JSON.stringify({
        name: authorSelected.label,
      }),
    );

    startTransition(async () => {
      const response = await editBookAction(formData);
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      toast.success(response.value.message);
    });
  }

  const srcImage = watch("image");
  const srcDebounced = useDebounce(srcImage);

  useEffect(
    function handleImageError() {
      setImageError(false);
    },
    [srcDebounced],
  );

  return (
    <form className="container-secondary" onSubmit={handleSubmit(submitFn)}>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative grid h-[340px] w-[260px] place-items-center bg-muted">
            {srcDebounced && !imageError ? (
              <Image
                style={{ aspectRatio: 340 / 260 }}
                onError={() => setImageError(true)}
                src={srcDebounced}
                fill
                alt="Image create"
              />
            ) : (
              <ImageIcon className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-4">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="title">Titulo</Label>
                  <Input required type="text" id="title" {...field} />
                  {errors?.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
                </div>
              )}
            />
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="image">Imagem URL</Label>
                  <Input required type="text" id="image" {...field} />
                  {errors?.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
                </div>
              )}
            />
            <Controller
              name="isbn"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input required type="text" id="isbn" {...field} disabled />
                  {errors?.isbn && <ErrorMessage>{errors.isbn.message}</ErrorMessage>}
                </div>
              )}
            />

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <Label>Tipo de Capa</Label>
                <Controller
                  name="coverType"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <Select {...rest} onValueChange={rest.onChange} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      {errors?.coverType && <ErrorMessage>{errors.coverType.message}</ErrorMessage>}
                      <SelectContent>
                        {coverTypeEntries.map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="language">Idioma</Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <Select {...rest} onValueChange={rest.onChange} required>
                      <SelectTrigger>
                        <SelectValue />
                        {errors?.language && <ErrorMessage>{errors.language.message}</ErrorMessage>}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="português">Português</SelectItem>
                        <SelectItem value="inglês">Inglês</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-1">
            <Label>Autor</Label>
            <AuthorSelect
              value={authorSelected}
              onSelect={setAuthorSelected}
              onSelected={() => {
                setAuthorError(null);
              }}
            />
            {authorError?.author && <ErrorMessage>{authorError.author.message}</ErrorMessage>}
          </div>
          <div className="flex-1 space-y-1">
            <Label>Categorias</Label>
            <MultipleSelector
              value={categoriesSelected}
              className="max-w-[350px]"
              creatable
              inputProps={{
                required: categoriesSelected.length <= 0,
              }}
              onChange={(option) => setCategoriesSelected(option)}
              defaultOptions={categoriesOptions}
              hidePlaceholderWhenSelected
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <Controller
              name="publisher"
              control={control}
              render={({ field }) => (
                <>
                  <Label htmlFor="publisher">Editora</Label>
                  <Input required type="text" id="publisher" {...field} />
                  {errors?.publisher && <ErrorMessage>{errors.publisher.message}</ErrorMessage>}
                </>
              )}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Controller
              name="publicationAt"
              control={control}
              render={({ field }) => (
                <>
                  <Label htmlFor="publicationAt">Data de Publicação</Label>
                  <Input required className="block" type="date" id="publicationAt" {...field} />
                  {errors?.publicationAt && (
                    <ErrorMessage>{errors.publicationAt.message}</ErrorMessage>
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <Controller
              name="copiesAvailable"
              control={control}
              render={({ field }) => (
                <>
                  <Label htmlFor="copiesAvailable">Cópias Disponíveis</Label>
                  <Input
                    required
                    type="number"
                    id="copiesAvailable"
                    autoComplete="off"
                    min={0}
                    {...field}
                  />
                  {errors?.copiesAvailable && (
                    <ErrorMessage>{errors.copiesAvailable.message}</ErrorMessage>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Controller
              name="pageCount"
              control={control}
              render={({ field }) => (
                <>
                  <Label htmlFor="pageCount">Número de Páginas</Label>
                  <Input required type="number" id="pageCount" autoComplete="off" {...field} />
                  {errors?.pageCount && <ErrorMessage>{errors.pageCount.message}</ErrorMessage>}
                </>
              )}
            />
          </div>
        </div>
        <div className="border p-4">
          <p className="mb-2 text-muted-foreground">Dimensões</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Controller
                name="width"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="width">Largura</Label>
                    <Input required id="width" type="number" autoComplete="off" {...field} />
                    {errors?.width && <ErrorMessage>{errors.width.message}</ErrorMessage>}
                  </>
                )}
              />
            </div>

            <div className="space-y-1">
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="height">Altura</Label>
                    <Input required id="height" autoComplete="off" type="number" {...field} />
                    {errors?.height && <ErrorMessage>{errors.height.message}</ErrorMessage>}
                  </>
                )}
              />
            </div>

            <div className="space-y-1">
              <Controller
                name="depth"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="depth">Profundidade</Label>
                    <Input required id="depth" autoComplete="off" type="number" {...field} />
                    {errors?.depth && <ErrorMessage>{errors.depth.message}</ErrorMessage>}
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <Controller
            name="sinopse"
            control={control}
            render={({ field }) => (
              <>
                <Label htmlFor="sinopse">Sinopse</Label>
                <Textarea required rows={25} id="sinopse" autoComplete="off" {...field} />
                {errors?.sinopse && <ErrorMessage>{errors.sinopse.message}</ErrorMessage>}
              </>
            )}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default FormEditBook;
