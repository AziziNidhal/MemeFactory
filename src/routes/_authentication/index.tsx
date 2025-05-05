import { createFileRoute } from "@tanstack/react-router";
import MemeFeedPage from "../../features/memes/pages/MemeFeedPage";

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});

