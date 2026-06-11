import { createFileRoute } from "@tanstack/react-router";

// Child route — parent /course reads lectureId from params and renders the player.
export const Route = createFileRoute("/course/$lectureId")({
  component: () => null,
});
