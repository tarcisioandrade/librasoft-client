import { SignupForm, signupSchema } from "@/schemas/session.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IFormSignupService } from "./form-signup.type";
import { useTransition } from "react";

export function useFormSignupModel(service: IFormSignupService) {
  const [isLoading, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", name: "", telephone: "" },
  });

  function submitFn(data: SignupForm) {
    const input = {
      email: data.email,
      password: data.password,
      name: data.name,
      telephone: data.telephone,
    };
    startTransition(async () => {
      const result = await service.signup(input);
      if (!result.success) {
        toast.error(result.error.message);
      }
    });
  }

  return {
    register,
    submitFn: handleSubmit(submitFn),
    errors,
    isLoading,
  };
}
