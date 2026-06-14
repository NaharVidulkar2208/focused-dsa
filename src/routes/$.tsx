import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/index") {
      throw redirect({ to: "/", replace: true });
    }

    throw notFound();
  },
});