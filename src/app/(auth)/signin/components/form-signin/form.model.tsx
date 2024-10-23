import { SigninForm, signinSchema } from "@/schemas/session.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { toast } from "sonner";
import { IFormSigninService } from "./form.type";

export function useFormSigninModel(service: IFormSigninService) {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const callbackUrl = useSearchParams()?.get("callbackUrl");

  function subminSignIn(data: SigninForm) {
    const input = {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl || "/",
    };
    startTransition(async () => {
      const result = await service.signIn(input);
      if (!result.success) {
        toast.error(result.error.message);
      }
    });
  }

  return {
    register,
    submitFn: handleSubmit(subminSignIn),
    errors,
    reset,
    isLoading,
  };
}
