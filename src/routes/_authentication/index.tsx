import { createFileRoute } from "@tanstack/react-router";
import MemeFeedPage from "../../pages/MemeFeedPage/MemeFeedPage";

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});

