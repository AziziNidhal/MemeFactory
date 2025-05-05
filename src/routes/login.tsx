
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../features/auth/pages/LoginPage";

type SearchParams = {
  redirect?: string;
};


export const Route = createFileRoute("/login")({
  validateSearch: (search): SearchParams => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    }
  },
  component: LoginPage,
});
