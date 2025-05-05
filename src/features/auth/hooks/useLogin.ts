import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api";
import { useAuthentication } from "../../../contexts/authentication";
import { LoginInputs } from "../types";

export const useLogin = () => {
  const { authenticate } = useAuthentication();

  return useMutation({
    mutationFn: (data: LoginInputs) => login(data.username, data.password),
    onSuccess: ({ jwt }) => {
      authenticate(jwt);
    },
  });
};
