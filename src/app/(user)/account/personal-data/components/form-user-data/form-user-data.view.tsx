import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormUserDataModel } from "./form-user-data.model";

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
              <Label htmlFor="telephone">Celular</Label>
              <Input required id="telephone" type="tel" {...field} />
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
              <Input required id="email" {...field} type="email" />
              {errors?.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
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
                  <Input
                    required
                    id="zipCode"
                    type="text"
                    placeholder="Ex. 12345000"
                    {...field}
                  />
                  {errors?.address?.zipCode && (
                    <p className="mt-1 text-xs text-destructive" data-testid="error-message">
                      {errors.address?.zipCode.message}
                    </p>
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
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address?.street.message}
                    </p>
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
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address?.district.message}
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
                  <Input
                    id="city"
                    className="placeholder:text-muted-foreground disabled:bg-muted"
                    disabled
                    placeholder="Insira o CEP acima para preencher a cidade"
                    {...field}
                  />
                  {errors?.address?.city && (
                    <p className="mt-1 text-xs text-destructive">{errors.address?.city.message}</p>
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
                    <p className="mt-1 text-xs text-destructive">{errors.address?.state.message}</p>
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
