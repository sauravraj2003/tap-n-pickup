import { createFileRoute } from "@tanstack/react-router";
import { VendorFeed } from "./home";

export const Route = createFileRoute("/barbers")({
  head: () => ({ meta: [{ title: "Barbers — BookIt" }] }),
  component: () => <VendorFeed kind="barber" />,
});
