import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar, Footer, StickyApply } from "../components/site";
import { publicAsset } from "../lib/public-asset";
import { SITE_NAME, SOCIAL_IMAGE } from "../lib/seo";
import { GOOGLE_SITE_VERIFICATION, gaBootstrapScript } from "../lib/analytics";
import { WhatsAppContact } from "../components/whatsapp-contact";
import { JoinCommunityProvider } from "../components/join-community";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kaushal Hub" },
      { name: "description", content: "Practical learning, knowledge and opportunity from Kaushal Hub." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:alt", content: "Kaushal Hub — Elevate Your Potential" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_IMAGE },
      { name: "theme-color", content: "#0F2747" },
      { name: "google-site-verification", content: GOOGLE_SITE_VERIFICATION },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" },
      { rel: "stylesheet", href: appCss },
      // Brand mark favicons at stable root URLs (Google Search reads these for the result icon).
      { rel: "icon", href: publicAsset("/favicon.ico"), sizes: "any" },
      { rel: "icon", href: publicAsset("/favicon.svg"), type: "image/svg+xml" },
      { rel: "icon", href: publicAsset("/favicon-48x48.png"), type: "image/png", sizes: "48x48" },
      { rel: "apple-touch-icon", href: publicAsset("/apple-touch-icon.png"), sizes: "180x180" },
    ],
    // Google Analytics 4 (loads asynchronously, live domain only).
    scripts: [{ children: gaBootstrapScript }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // The SPA fallback shell (served as _shell.html / 404.html) has no page content of its
  // own, so search engines must not index it. Real prerendered pages are unaffected.
  // The client router doesn't know it was a shell render, so it keeps what the server sent.
  const router = useRouter();
  const isShell =
    typeof document === "undefined"
      ? router.isShell()
      : document.head.querySelector('meta[name="robots"][content="noindex"]') !== null;
  return (
    <html lang="en">
      <head>
        {isShell && <meta name="robots" content="noindex" />}
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useScrollReveal(pathname);
  const programCta = {
    ctaLabel: "Apply Now",
    ctaTo: "/experience-to-enterprise",
    ctaHash: "application",
  };
  // The Microsoft AI course has no application form of its own, so its phone bar offers an
  // enquiry instead of pointing visitors to the Experience to Enterprise application.
  const stickyCta =
    pathname.replace(/\/$/, "") === "/programs/generative-ai-in-action"
      ? { ctaLabel: "Get in Touch", ctaTo: "/contact", ctaHash: "", ctaSearch: { interest: "generative-ai-in-action" } }
      : programCta;

  return (
    <QueryClientProvider client={queryClient}>
      <JoinCommunityProvider>
      <Navbar />
      <main>
        {/* Keyed so each route's opening section plays its entrance once. */}
        <div key={pathname} className="kh-page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <StickyApply {...stickyCta} />
      <WhatsAppContact />
      </JoinCommunityProvider>
    </QueryClientProvider>
  );
}
