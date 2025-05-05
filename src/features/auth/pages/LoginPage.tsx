import { Flex, Heading, Text } from "@chakra-ui/react";
import { Navigate } from "@tanstack/react-router";
import { useAuthentication } from "../../../contexts/authentication";
import { Route } from "../../../routes/login";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  const { redirect } = Route.useSearch();
  const { state } = useAuthentication();

  if (state.isAuthenticated) {
    return <Navigate to={redirect ?? "/"} />;
  }

  return (
    <Flex height="full" width="full" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        bgGradient="linear(to-br, cyan.100, cyan.200)"
        p={8}
        borderRadius={16}
      >
        <Heading as="h2" size="md" textAlign="center" mb={4}>
          Login
        </Heading>
        <Text textAlign="center" mb={4}>
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <LoginForm />
      </Flex>
    </Flex>
  );
};
