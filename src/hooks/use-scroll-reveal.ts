import { useEffect } from "react";

const STAGGER_MS = 80;
const MAX_DELAY_MS = 400;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Fades sections in as they scroll into view, without touching page markup.
 *
 * Targets the direct children of each section's `.container-site`. When a child is a
 * grid or list of cards, its items are revealed one after another instead.
 *
 * Uses the Web Animations API rather than classes or attributes, so React-owned DOM
 * (including server-rendered markup that is still hydrating) is never mutated. Elements
 * already on screen are never hidden, and the effect is skipped entirely for
 * reduced-motion users or browsers without IntersectionObserver / element.animate.
 */
export function useScrollReveal(routeKey: string) {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (typeof Element.prototype.animate !== "function") return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    const scanned = new WeakSet<Element>();
    const pending = new Map<Element, Animation>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          pending.get(entry.target)?.play();
          pending.delete(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const isGroup = (el: Element) => {
      if (el.hasAttribute("data-kh-reveal-group")) return true;
      if (el.children.length < 2) return false;
      return getComputedStyle(el).display === "grid" || el.tagName === "OL" || el.tagName === "UL";
    };

    const prepare = (el: Element, index: number) => {
      if (scanned.has(el)) return;
      scanned.add(el);
      const rect = el.getBoundingClientRect();
      // Already visible (or not laid out): leave it alone so nothing flickers.
      if (rect.height === 0 || rect.top < window.innerHeight * 0.92) return;
      const animation = el.animate(
        [
          { opacity: 0, transform: "translate3d(0, 28px, 0)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 850, easing: EASING, delay: Math.min(index * STAGGER_MS, MAX_DELAY_MS), fill: "backwards" },
      );
      animation.pause(); // Holds the first frame (hidden) until the element scrolls into view.
      pending.set(el, animation);
      observer.observe(el);
    };

    const scan = () => {
      main.querySelectorAll("section:not([data-hero]) > .container-site").forEach((container) => {
        if (scanned.has(container)) return;
        scanned.add(container);
        Array.from(container.children).forEach((child) => {
          if (isGroup(child)) Array.from(child.children).forEach(prepare);
          else prepare(child, 0);
        });
      });
    };

    // A fast fling can carry an element past the viewport between observer samples;
    // reveal anything that is already at or above the fold.
    const sweep = () => {
      pending.forEach((animation, el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          animation.play();
          pending.delete(el);
          observer.unobserve(el);
        }
      });
    };

    /**
     * Runs a task on the next frame, with a timer as a backstop: frames can be paused
     * (background tabs, hidden embeds) and a reveal must never depend on them alone.
     */
    const schedule = (task: () => void) => {
      let done = false;
      const run = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(frameId);
        clearTimeout(timerId);
        task();
      };
      const frameId = requestAnimationFrame(run);
      const timerId = setTimeout(run, 150);
      return () => {
        done = true;
        cancelAnimationFrame(frameId);
        clearTimeout(timerId);
      };
    };

    let cancelSweep: (() => void) | null = null;
    const onScroll = () => {
      if (cancelSweep || !pending.size) return;
      cancelSweep = schedule(() => {
        cancelSweep = null;
        sweep();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Route components can mount a frame later (code-split chunks), so watch for them.
    // Scanning (which hides below-the-fold content) deliberately waits for a real frame:
    // a page that is not rendering cannot run the observer that reveals it again.
    const scanOnFrame = () => {
      const id = requestAnimationFrame(scan);
      return () => cancelAnimationFrame(id);
    };
    let cancelScan = scanOnFrame();
    const mutations = new MutationObserver(() => {
      cancelScan();
      cancelScan = scanOnFrame();
    });
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      cancelScan();
      cancelSweep?.();
      window.removeEventListener("scroll", onScroll);
      mutations.disconnect();
      observer.disconnect();
      // Never leave content hidden behind an observer that no longer exists.
      pending.forEach((animation) => animation.finish());
      pending.clear();
    };
  }, [routeKey]);
}
