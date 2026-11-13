import { useEffect, useRef, useState } from "react";

/**
 * "The Innovation Spark": a small navy ring with an orange spark at its centre.
 *
 * - Only runs on devices with a fine pointer that can hover (mouse / trackpad). Touch,
 *   pen-only and coarse-pointer devices keep the normal browser behaviour.
 * - Purely decorative and `pointer-events: none`, so it never intercepts clicks, links,
 *   buttons or text selection. Keyboard focus styles are untouched.
 * - States: default, `link` (buttons/links: slightly larger with a soft orange glow) and
 *   `card` (cards/images: a larger thin outline, spark kept). Over text fields it steps
 *   aside so the native text caret is shown.
 * - The spark tracks the pointer exactly; the ring eases after it. With
 *   prefers-reduced-motion the ring follows instantly and state changes are not animated.
 * - The animation loop only runs while the ring is catching up, then stops.
 */

type CursorState = "default" | "link" | "card" | "text" | "hidden";

const INTERACTIVE = 'a[href], button, [role="button"], summary, label, select, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]';
const TEXT_ENTRY = 'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable=""], [contenteditable="true"]';
const CARD = "img, video, picture, figure, article, .shadow-card, .shadow-lift, .shadow-float";
/** Interactive elements larger than this (px²) are treated as cards, e.g. whole-card links. */
const CARD_AREA = 48000;

function stateFor(target: Element | null): CursorState {
  if (!target) return "default";
  if (target.closest(TEXT_ENTRY)) return "text";
  const interactive = target.closest(INTERACTIVE);
  if (interactive) {
    // Buttons (including wide accordion rows) always read as buttons; only large links are cards.
    if (interactive.tagName !== "A") return "link";
    const { width, height } = interactive.getBoundingClientRect();
    return width * height > CARD_AREA ? "card" : "link";
  }
  return target.closest(CARD) ? "card" : "default";
}

export function InnovationSparkCursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);

  // Decide on the client only, after hydration, so server HTML is never affected.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(finePointer.matches);
    update();
    finePointer.addEventListener("change", update);
    return () => finePointer.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const spark = sparkRef.current;
    if (!ring || !spark) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    root.setAttribute("data-kh-cursor", "on");

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let frame = 0;
    let visible = false;
    let state: CursorState = "hidden";

    const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const setState = (next: CursorState) => {
      if (next === state) return;
      state = next;
      ring.setAttribute("data-state", next);
      spark.setAttribute("data-state", next);
    };

    const tick = () => {
      frame = 0;
      const ease = reducedMotion.matches ? 1 : 0.24;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      place(ring, current.x, current.y);
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        frame = requestAnimationFrame(tick);
      } else {
        current.x = target.x;
        current.y = target.y;
        place(ring, current.x, current.y);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      target.x = clamp(event.clientX, window.innerWidth);
      target.y = clamp(event.clientY, window.innerHeight);
      place(spark, target.x, target.y);
      if (!visible) {
        // Appear in place rather than gliding in from the corner.
        visible = true;
        current.x = target.x;
        current.y = target.y;
        place(ring, current.x, current.y);
      }
      setState(stateFor(event.target as Element));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const hide = () => {
      visible = false;
      setState("hidden");
    };
    const onLeaveWindow = (event: MouseEvent) => {
      if (!event.relatedTarget) hide();
    };
    const onDown = () => ring.setAttribute("data-pressed", "");
    const onUp = () => ring.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onLeaveWindow);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeaveWindow);
      window.removeEventListener("blur", hide);
      root.removeAttribute("data-kh-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="kh-cursor">
      <div ref={ringRef} className="kh-cursor-ring" data-state="hidden" />
      <div ref={sparkRef} className="kh-cursor-spark" data-state="hidden" />
    </div>
  );
}
