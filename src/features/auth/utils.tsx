import { FormErrorMessage } from "@chakra-ui/react";
import { UnauthorizedError } from "../../api";

export function renderLoginError(error: Error) {
  if (error instanceof UnauthorizedError) {
    return <FormErrorMessage>Wrong credentials</FormErrorMessage>;
  }
  return (
    <FormErrorMessage>
      An unknown error occurred, please try again later.
    </FormErrorMessage>
  );
}