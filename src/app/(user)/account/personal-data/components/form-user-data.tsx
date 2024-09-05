"use client";

import {UserUpdate, userUpdateSchema, zipCodeSchema } from "@/schemas/user.schema";
import React, { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserAction } from "@/actions/user/update.action";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { ViaCepService } from "@/services/via-cep.service";
import { User } from "@/types/User";

type Props = {
  user: User;
};

const viaCepService = new ViaCepService();

const FormUserData = ({ user }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<UserUpdate>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      telephone: user.telephone,
      email: user.email,
      address: {
        city: user.address?.city || "",
        country: user.address?.country || "",
        state: user.address?.state || "",
        street: user.address?.street || "",
        zipCode: user.address?.zipCode || "",
      },
    },
  });
  const [isLoading, startTransition] = useTransition();

  function submitFn(data: UserUpdate) {
    startTransition(async () => {
      const res = await updateUserAction(data);
      if (!res.success) {
        toast.error(res.error.message);
        return;
      }
      toast.success(res.value.message);
    });
  }

  const cepValue = watch("address.zipCode");
  const debouncedValue = useDebounce(cepValue, 1000);

  async function handlerCep(cep: string) {
    const parsed = zipCodeSchema.safeParse(cep);
    if (!parsed.success) {
      setError("address.zipCode", {
        message: parsed.error.flatten().formErrors[0],
      });
      return;
    }
    if (errors.address?.zipCode) clearErrors("address.zipCode");

    const response = await viaCepService.Get(cep);

    if (response?.estado) {
      setValue("address.state", response.estado);
    }

    if (response?.localidade) {
      setValue("address.city", response.localidade);
    }

    if (response?.logradouro) {
      setValue("address.street", response.logradouro);
    }
    if (response?.uf) {
      setValue("address.country", response.uf);
    }
  }
  
  useEffect(() => {
    handlerCep(debouncedValue);
  }, [debouncedValue]);

  return (
    <form onSubmit={handleSubmit(submitFn)} className="px-4">
      <div className="mt-4 space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...field} />
              {errors?.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="telephone"
          render={({ field }) => (
            <div>
              <Label htmlFor="telephone">Telefone Celular</Label>
              <Input id="telephone" type="tel" {...field} />
              {errors?.telephone && (
                <p className="mt-1 text-xs text-destructive">{errors.telephone.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" {...field} type="email" />
              {errors?.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          )}
        />

        <div className="border">
          <header className="w-full bg-secondary px-4 py-2">
            <p className="text-sm text-muted-foreground">Endereço</p>
          </header>
          <div className="space-y-4 p-4">
            <Controller
              control={control}
              name="address.zipCode"
              render={({ field }) => (
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" type="number" maxLength={8} {...field} />
                  {errors?.address?.zipCode && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address?.zipCode.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="address.city"
              render={({ field }) => (
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...field} />
                  {errors?.address?.city && (
                    <p className="mt-1 text-xs text-destructive">{errors.address?.city.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="address.street"
              render={({ field }) => (
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" {...field} />
                  {errors?.address?.street && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address?.street.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="address.state"
              render={({ field }) => (
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" {...field} />
                  {errors?.address?.state && (
                    <p className="mt-1 text-xs text-destructive">{errors.address?.state.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="address.country"
              render={({ field }) => (
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input id="country" {...field} />
                  {errors?.address?.country && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address?.country.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          Atualizar
        </Button>
      </div>
    </form>
  );
};

export default FormUserData;
