import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/photo-upload")({
  beforeLoad: () => {
    throw redirect({ to: "/field-audits" });
  },
});
