import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormUserDataModel } from "./form-user-data.model";
import ErrorMessage from "@/components/ui/error-message";

type Props = ReturnType<typeof useFormUserDataModel>;

const FormUserData = (props: Props) => {
  const { debouncedValue, errors, handleCep, isLoading, control, Controller, submitFn, user } =
    props;

  useEffect(() => {
    handleCep(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <form onSubmit={submitFn} className="px-4">
      <div className="mt-4 space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input required id="name" {...field} />
              {errors?.name && <ErrorMessage className="mt-1">{errors.name.message}</ErrorMessage>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="telephone"
          render={({ field }) => (
            <div>
              <Label htmlFor="telephone">Celular</Label>
              <Input required id="telephone" type="tel" {...field} />
              {errors?.telephone && (
                <ErrorMessage className="mt-1">{errors.telephone.message}</ErrorMessage>
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
              <Input required id="email" {...field} type="email" />
              {errors?.email && (
                <ErrorMessage className="mt-1">{errors.email.message}</ErrorMessage>
              )}
            </div>
          )}
        />

        <div className="border">
          <header className="w-full items-center gap-2 bg-secondary px-4 py-2">
            <p className="text-sm text-muted-foreground">Endereço</p>{" "}
            {!user.address ? (
              <span className="text-xs text-red-500" data-testid="alert-message">
                Preencha seu endereço para começar a alugar livros.
              </span>
            ) : null}
          </header>
          <div className="space-y-4 p-4">
            <Controller
              control={control}
              name="address.zipCode"
              render={({ field }) => (
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input required id="zipCode" type="text" placeholder="Ex. 12345000" {...field} />
                  {errors?.address?.zipCode && (
                    <ErrorMessage className="mt-1" data-testid="error-message">
                      {errors.address?.zipCode.message}
                    </ErrorMessage>
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
                  <Input required id="street" {...field} />
                  {errors?.address?.street && (
                    <ErrorMessage className="mt-1">{errors.address?.street.message}</ErrorMessage>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="address.district"
              render={({ field }) => (
                <div>
                  <Label htmlFor="district">Bairro</Label>
                  <Input required id="district" {...field} />
                  {errors?.address?.district && (
                    <ErrorMessage className="mt-1">{errors.address?.district.message}</ErrorMessage>
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
                  <Input
                    id="city"
                    className="placeholder:text-muted-foreground disabled:bg-muted"
                    disabled
                    placeholder="Insira o CEP acima para preencher a cidade"
                    {...field}
                  />
                  {errors?.address?.city && (
                    <ErrorMessage className="mt-1">{errors.address?.city.message}</ErrorMessage>
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
                  <Input
                    id="state"
                    className="placeholder:text-muted-foreground disabled:bg-muted"
                    disabled
                    placeholder="Insira o CEP acima para preencher o estado"
                    {...field}
                  />
                  {errors?.address?.state && (
                    <ErrorMessage className="mt-1">{errors.address?.state.message}</ErrorMessage>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" data-testid="submit-button" disabled={isLoading}>
          Atualizar
        </Button>
      </div>
    </form>
  );
};

export default FormUserData;
