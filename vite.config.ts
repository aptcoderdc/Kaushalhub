// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// Plain data module (no "@/" imports), safe to load from the Vite config.
import { publishedPagePaths } from "./src/lib/resources";

// Set by the GitHub Pages workflow (e.g. "/pixel-perfect-replica/"). Unset for Lovable builds.
const pagesBase = process.env["GITHUB_PAGES_BASE"];

/**
 * Pages to prerender in addition to those reached by following links. Link crawling alone
 * misses Knowledge Library articles that sit behind "Load More", which then return 404 on
 * GitHub Pages. Includes "/", so the homepage is a fully rendered index.html.
 */
const prerenderPages = [
  ...publishedPagePaths().map((path) => ({ path })),
  { path: "/sitemap.xml", sitemap: { exclude: true } },
];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // GitHub Pages is static hosting: prerender every public page and emit an SPA shell fallback.
    ...(pagesBase && {
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // The SPA shell is rendered from "/?spa-shell" rather than "/", so it no longer takes the
      // homepage's place: "/" is prerendered as a full index.html, and the shell is still
      // written to _shell.html, which the deploy workflow copies to 404.html.
      spa: { enabled: true, maskPath: "/?spa-shell" },
      pages: prerenderPages,
    }),
  },
  ...(pagesBase && { nitro: false as const, vite: { base: pagesBase } }),
});
