import { createFileRoute } from "@tanstack/react-router";
import { VendorFeed } from "./home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookIt — Skip the queue at campus canteens & barbers" },
      { name: "description", content: "Pre-order from canteens and barbers across campus. Pay ahead, get a token, walk in — no waiting in line." },
    ],
  }),
  component: () => <VendorFeed kind="canteen" />,
});
