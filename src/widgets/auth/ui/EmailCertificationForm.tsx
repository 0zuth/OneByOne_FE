import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useCheckEmailCertification, useResetPassword } from "@/entities/auth/hooks";
import CertificationField from "@/features/form/ui/fields/CertificationField";
import SubmitButton from "@/features/form/ui/SubmitButton";
import { Form } from "@/shared/ui/form";

const step2Schema = z.object({
  certification: z.string().min(1, "인증번호를 입력해주세요."),
});

export type EmailCertificationFormValues = z.infer<typeof step2Schema>;

interface EmailCertificationFormProps {
  email: string;
  onNext: (certification?: string) => void;
  mode?: "signup" | "findPassword";
}

export function EmailCertificationForm({
  email,
  onNext,
  mode = "signup",
}: EmailCertificationFormProps) {
  const { mutate: checkEmail, isPending: isCheckPending } =
    useCheckEmailCertification();
  const { mutate: resetPassword, isPending: isResetPending } =
    useResetPassword();

  const isPending = isCheckPending || isResetPending;

  const form = useForm<EmailCertificationFormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: { certification: "" },
    mode: "onChange",
  });

  const onSubmit = (data: EmailCertificationFormValues) => {
    if (mode === "findPassword") {
      // 비밀번호 찾기: 임시 비밀번호 발급 API 호출
      resetPassword(
        { email, code: data.certification },
        {
          onSuccess: () => {
            onNext(data.certification);
          },
        }
      );
    } else {
      // 회원가입: 인증번호 검증만
      checkEmail(
        { email, certification: data.certification },
        {
          onSuccess: (success: boolean) => {
            if (success) onNext(data.certification);
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <CertificationField control={form.control} disabled={isPending} />
        <SubmitButton
          label="확인"
          disabled={!form.formState.isValid || isPending}
          isLoading={isPending}
        />
      </form>
    </Form>
  );
}
