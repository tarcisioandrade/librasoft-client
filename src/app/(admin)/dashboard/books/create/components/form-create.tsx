"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Category } from "@/types/Category";
import { ECoverType } from "@/enums/ECoverType";
import { AuthorSelect } from "../../../components/author-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookFormSchema, CreateBookFormType } from "@/schemas/create-book.schema";
import { Button } from "@/components/ui/button";
import { createBookAction } from "@/actions/book/create.action";
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

type Props = {
  categories: Category[];
};

type AuthorError = {
  author?: {
    message: string;
  };
};

const FormCreateBook = ({ categories }: Props) => {
  const [categoriesSelected, setCategoriesSelected] = useState<Option[]>([]);
  const [authorSelected, setAuthorSelected] = useState<Option | null>(null);
  const [authorError, setAuthorError] = useState<AuthorError | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<CreateBookFormType>({
    resolver: zodResolver(createBookFormSchema),
    defaultValues: {
      depth: "",
      height: "",
      image: "",
      isbn: "",
      publicationAt: "",
      publisher: "",
      sinopse: "",
      title: "",
      width: "",
      copiesAvailable: "1",
      pageCount: "1",
    },
  });

  const categoriesOptions: Option[] = useMemo(
    () =>
      categories.map((categ) => ({
        label: categ.title,
        value: categ.title,
      })),
    [],
  );

  const coverTypeEntries = Object.entries(ECoverType);

  function submitFn(input: CreateBookFormType) {
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
      const response = await createBookAction(formData);
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      toast.success(response.value.message);
      clearAllFields();
    });
  }

  function clearAllFields() {
    reset();
    setAuthorSelected(null);
    setCategoriesSelected([]);
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
                  {errors?.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
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
                  {errors?.image && (
                    <p className="text-xs text-destructive">{errors.image.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="isbn"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="isbn">ISBN-10</Label>
                  <Input required type="text" id="isbn" {...field} />
                  {errors?.isbn && (
                    <p className="text-xs text-destructive">{errors.isbn.message}</p>
                  )}
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
                      {errors?.coverType && (
                        <p className="text-xs text-destructive">{errors.coverType.message}</p>
                      )}
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
                        {errors?.language && (
                          <p className="text-xs text-destructive">{errors.language.message}</p>
                        )}
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
              onSelected={(option) => {
                setAuthorSelected(option);
                setAuthorError(null);
              }}
            />
            {authorError?.author && (
              <p className="text-xs text-destructive">{authorError.author.message}</p>
            )}
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
                  {errors?.publisher && (
                    <p className="text-xs text-destructive">{errors.publisher.message}</p>
                  )}
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
                    <p className="text-xs text-destructive">{errors.publicationAt.message}</p>
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
                  <Input required type="number" id="copiesAvailable" min={0} {...field} />
                  {errors?.copiesAvailable && (
                    <p className="text-xs text-destructive">{errors.copiesAvailable.message}</p>
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
                  <Input required type="number" id="pageCount" {...field} />
                  {errors?.pageCount && (
                    <p className="text-xs text-destructive">{errors.pageCount.message}</p>
                  )}
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
                    <Input required id="width" type="number" {...field} />
                    {errors?.width && (
                      <p className="text-xs text-destructive">{errors.width.message}</p>
                    )}
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
                    <Input required id="height" type="number" {...field} />
                    {errors?.height && (
                      <p className="text-xs text-destructive">{errors.height.message}</p>
                    )}
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
                    <Input required id="depth" type="number" {...field} />
                    {errors?.depth && (
                      <p className="text-xs text-destructive">{errors.depth.message}</p>
                    )}
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
                <Textarea required rows={25} id="sinopse" {...field} />
                {errors?.sinopse && (
                  <p className="text-xs text-destructive">{errors.sinopse.message}</p>
                )}
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

export default FormCreateBook;
