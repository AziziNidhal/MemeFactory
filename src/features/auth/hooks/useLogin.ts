import { useMutation } from "@tanstack/react-query";
import { useAuthentication } from "../../../contexts/authentication";
import { LoginInputs } from "../types";
import { login } from "../api/login";

export const useLogin = () => {
  const { authenticate } = useAuthentication();

  return useMutation({
    mutationFn: (data: LoginInputs) => login(data.username, data.password),
    onSuccess: ({ jwt }) => {
      authenticate(jwt);
    },
  });
};
