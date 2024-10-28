import { useDebounce } from "@/hooks/use-debounce";
import { UserUpdate, userUpdateSchema, zipCodeSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { IFormUserDataService, IFormUserDataSummary } from "./form-user-data.type";

export function useFormUserDataModel(service: IFormUserDataService, summary: IFormUserDataSummary) {
  const { user } = summary;
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
        district: user.address?.district || "",
        state: user.address?.state || "",
        street: user.address?.street || "",
        zipCode: user.address?.zipCode || "",
      },
    },
  });
  const [isLoading, startTransition] = useTransition();

  function submitFn(data: UserUpdate) {
    startTransition(async () => {
      const res = await service.update(data);
      if (!res.success) {
        toast.error(res.error.message);
        return;
      }
      toast.success(res.value.message);
    });
  }

  const cepValue = watch("address.zipCode");
  const debouncedValue = useDebounce(cepValue, 1000);

  async function handleCep(cep: string) {
    if (!cep) return;
    
    const parsed = zipCodeSchema.safeParse(cep);
    if (!parsed.success) {
      return setError("address.zipCode", {
        message: parsed.error.flatten().formErrors[0],
      });
    }
    if (errors.address?.zipCode) clearErrors("address.zipCode");

    const response = await service.getAddressWithCep(cep);

    if (!response.success) {
      return setError("address.zipCode", {
        message: response.error.message,
      });
    }

    setValue("address.state", response.value.estado);
    setValue("address.city", response.value.localidade);
    setValue("address.street", response.value.logradouro);
    setValue("address.district", response.value.bairro);
  }

  return {
    handleCep,
    submitFn: handleSubmit(submitFn),
    Controller,
    errors,
    isLoading,
    debouncedValue,
    user,
    control,
  };
}
