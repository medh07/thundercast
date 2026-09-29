import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/pages/Overview";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Overview | ThunderCast AI" },
    { name: "description", content: "Monitor Delhi NCR thunderstorms, lightning and AI nowcasts in the ThunderCast operations overview." },
    { property: "og:title", content: "Overview | ThunderCast AI" },
    { property: "og:description", content: "A meteorological operations dashboard for Delhi NCR storm and lightning nowcasting." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Overview,
});
