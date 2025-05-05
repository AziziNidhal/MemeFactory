import {
    FormControl,
    FormLabel,
    Input,
    Button,
  } from "@chakra-ui/react";
  import { useForm, SubmitHandler } from "react-hook-form";
  import { LoginInputs } from "../types";
  import { useLogin } from "../hooks/useLogin";
import { renderLoginError } from "../utils";
  
  export const LoginForm = () => {
    const { register, handleSubmit } = useForm<LoginInputs>();
    const { mutate, isPending, error } = useLogin();
  
    const onSubmit: SubmitHandler<LoginInputs> = (data) => {
      mutate(data);
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            bg="white"
            size="sm"
            {...register("username")}
          />
        </FormControl>
        <FormControl isInvalid={error !== null}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            bg="white"
            size="sm"
            {...register("password")}
          />
          {error !== null && renderLoginError(error)}
        </FormControl>
        <Button
          color="white"
          colorScheme="cyan"
          mt={4}
          size="sm"
          type="submit"
          width="full"
          isLoading={isPending}
        >
          Login
        </Button>
      </form>
    );
  };
  