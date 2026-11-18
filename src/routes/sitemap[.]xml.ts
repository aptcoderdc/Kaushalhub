import { createFileRoute } from "@tanstack/react-router";
import { sitemapXml } from "@/lib/seo";

/**
 * /sitemap.xml — built from the program list and the published Knowledge Library, so new
 * published articles are included automatically. Prerendered to a static file for
 * GitHub Pages (see `pages` in vite.config.ts).
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        }),
    },
  },
});
