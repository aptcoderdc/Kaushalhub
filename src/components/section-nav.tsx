import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionNavItem = { id: string; label: string };

/**
 * Sticky, horizontally scrollable in-page navigation for long program pages.
 *
 * - Sticks directly under the site header (64px mobile, 80px desktop).
 * - Highlights the section currently under the reading line.
 * - Smooth-scrolls to a section on click (instant for reduced-motion users) and keeps the
 *   URL hash in sync without adding history entries.
 * - Keeps the active tab scrolled into view inside the bar on small screens.
 */
export function SectionNav({ items, cta }: { items: SectionNavItem[]; cta?: { label: string; href: string } }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [stuck, setStuck] = useState(false);
  const [edges, setEdges] = useState({ start: false, end: false });
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  // Active section: the last section whose top has passed the reading line under the bars.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const nav = navRef.current;
      if (!nav) return;
      const navBottom = nav.getBoundingClientRect().bottom;
      setStuck(nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 0.5);
      const line = navBottom + 24;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      // At the very bottom of the page, the last section wins even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = items[items.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Keep the active tab visible inside the horizontally scrolling bar.
  useEffect(() => {
    const track = trackRef.current;
    const tab = track?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!track || !tab) return;
    const bar = track.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    const margin = 48; // room for the edge fades
    if (rect.left >= bar.left + margin && rect.right <= bar.right - margin) return;
    const delta = rect.left + rect.width / 2 - (bar.left + bar.width / 2);
    track.scrollTo({ left: Math.max(0, track.scrollLeft + delta), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active]);

  // Edge fades / arrows only when there is more to scroll in that direction.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({ start: track.scrollLeft > 2, end: track.scrollLeft < track.scrollWidth - track.clientWidth - 2 });
    update();
    track.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    ro?.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
    setActive(id);
  };

  const nudge = (direction: -1 | 1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.6, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Program sections"
      className={cn(
        "sticky top-16 z-30 border-y transition-[background-color,box-shadow,border-color] duration-500 ease-brand md:top-20",
        stuck
          ? "border-border/80 bg-background/90 shadow-[0_12px_28px_-20px_oklch(0.27_0.07_257/45%)] backdrop-blur-xl backdrop-saturate-150"
          : "border-border/70 bg-card",
      )}
    >
      <div className="container-site flex items-center gap-2">
        <EdgeButton side="start" visible={edges.start} onClick={() => nudge(-1)} />
        <div className="relative min-w-0 flex-1">
          <ul
            ref={trackRef}
            className="flex gap-1 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    data-section={item.id}
                    onClick={(event) => go(event, item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3.5 text-[14px] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-navy md:px-4 md:text-[15px]",
                      isActive ? "text-navy" : "text-slate hover:bg-tint/60 hover:text-navy",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-2 h-[3px] origin-center rounded-full bg-saffron transition-transform duration-500 ease-brand",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          {/* Fades hint that the bar scrolls sideways */}
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent transition-opacity", stuck && "from-background", edges.start ? "opacity-100" : "opacity-0")} />
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent transition-opacity", stuck && "from-background", edges.end ? "opacity-100" : "opacity-0")} />
        </div>
        <EdgeButton side="end" visible={edges.end} onClick={() => nudge(1)} />
        {cta && (
          <a
            href={cta.href}
            onClick={(event) => go(event, cta.href.replace(/^#/, ""))}
            className={cn(
              "kh-sheen hidden h-10 shrink-0 items-center rounded-lg bg-saffron bg-[linear-gradient(180deg,oklch(0.78_0.14_66),var(--color-saffron))] px-4 text-[14px] font-semibold text-navy shadow-[var(--kh-shadow-cta)] outline-none transition-[opacity,transform] duration-500 ease-brand focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 lg:inline-flex",
              stuck ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0",
            )}
            tabIndex={stuck ? 0 : -1}
            aria-hidden={!stuck}
          >
            {cta.label}
          </a>
        )}
      </div>
    </nav>
  );
}

function EdgeButton({ side, visible, onClick }: { side: "start" | "end"; visible: boolean; onClick: () => void }) {
  const Icon = side === "start" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        "hidden h-8 w-8 shrink-0 place-items-center rounded-full border bg-card text-navy shadow-card transition-opacity duration-300 hover:border-navy/40 md:grid",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
