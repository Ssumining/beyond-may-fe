import { useMutation } from "@tanstack/react-query";

import { postSignup } from "@/services/api/auth/authApi";
import useSessionStore from "@/stores/sessionStore";
import useAccountStore from "@/stores/accountStore";

export const usePostSignupMutation = () => {
  const setSession = useSessionStore((state) => state.setSession);
  const markHasAccount = useAccountStore((state) => state.markHasAccount);

  return useMutation({
    mutationFn: postSignup,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.token);
      setSession(data.nickname, data.identificationCode);
      markHasAccount();
    },
  });
};
