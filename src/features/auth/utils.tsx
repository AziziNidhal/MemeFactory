import { FormErrorMessage } from "@chakra-ui/react";
import { NotFoundError, UnauthorizedError } from "../../types/Error";



function checkStatus(response: Response) {
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status === 404) {
    throw new NotFoundError();
  }
  return response;
}


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