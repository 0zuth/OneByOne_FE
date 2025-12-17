import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { resetPassword } from "@/entities/auth/api";
import { URL_PATHS } from "@/shared/constants/url-path";
import { toast } from "@/shared/hooks/useToast";

import { ResetPasswordRequest, ResetPasswordResponse } from "../DTO.d";

/**
 * 임시 비밀번호 요청 API 호출
 * - 에러 처리
 * - 토스트 관리
 * - 성공 시 로그인 페이지로 이동
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: "본인 확인 완료",
        description: (
          <>
            메일로 임시 비밀번호를 보내드렸어요. 📧 <br />{" "}
            <strong>임시 비밀번호</strong>로 로그인해주세요.
          </>
        ),
        variant: "default",
      });
      navigate(URL_PATHS.SIGNIN);
    },
    onError: (error) => {
      let errorMessage = "잠시 후 다시 시도해주세요.";

      if (error instanceof Error && error.message) {
        if (error.message !== "Failed to fetch") {
          errorMessage = error.message;
        }
      }

      toast({
        title: "임시 비밀번호 발송 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
