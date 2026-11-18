import { createFileRoute } from "@tanstack/react-router";
import { llmsTxt } from "@/lib/seo";

/**
 * /llms.txt — a Markdown site map for AI assistants, built from the published pages, programs
 * and articles. Prerendered to a static file for GitHub Pages (see `pages` in vite.config.ts).
 */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
