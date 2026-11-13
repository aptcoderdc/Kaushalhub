import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type ComponentProps } from "react";
import { ChevronDown, Menu, X, Check, ArrowRight, ArrowUpRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/public-asset";
import { brandLogos } from "@/lib/brand";
import type { Program } from "@/lib/programs";
import { featuredProgram, supportingPrograms } from "@/lib/program-nav";

/* ---------- Button ---------- */
type Variant = "primary" | "secondary" | "inverse" | "text";
const FITT_LOGO_SRC = publicAsset("/images/organisations/fitt-iit-delhi.webp");
const btn: Record<Variant, string> = {
  primary:
    "kh-sheen h-12 px-6 rounded-lg bg-saffron bg-[linear-gradient(180deg,oklch(0.78_0.14_66),var(--color-saffron))] text-navy font-semibold shadow-[var(--kh-shadow-cta)] hover:-translate-y-0.5 hover:shadow-[var(--kh-shadow-cta-hover)] active:translate-y-0 active:scale-[0.98] focus-visible:ring-navy",
  secondary:
    "h-12 px-6 rounded-lg border border-navy/80 bg-card/60 text-navy font-semibold backdrop-blur-sm hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-primary-foreground hover:shadow-lift active:translate-y-0 active:scale-[0.98] focus-visible:ring-navy",
  inverse:
    "h-12 px-6 rounded-lg border border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground font-semibold backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary-foreground/80 hover:bg-primary-foreground/12 active:translate-y-0 active:scale-[0.98] focus-visible:ring-primary-foreground focus-visible:ring-offset-navy",
  text: "group/btn min-h-11 text-navy font-semibold hover:text-ink focus-visible:rounded-sm focus-visible:ring-navy",
};
export function buttonClass(v: Variant = "primary", extra?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 text-[16px] outline-none transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-brand focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    btn[v],
    extra,
  );
}
export function SiteButton({ className, variant = "primary", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button {...props} className={buttonClass(variant, className)} />;
}
export function ButtonLink({ to, hash, search, variant = "primary", children, className }: { to: string; hash?: string; search?: Record<string, unknown>; variant?: Variant; children: ReactNode; className?: string }) {
  return (
    <Link to={to} {...(hash ? { hash } : {})} {...(search ? { search } : {})} className={buttonClass(variant, className)}>
      {children}{variant === "text" && <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 group-hover/btn:translate-x-1 motion-reduce:transition-none" />}
    </Link>
  );
}

/* ---------- Logos ---------- */
/** `light` renders the reversed logo for the dark footer; otherwise the primary logo. */
export function Logo({ light }: { light?: boolean }) {
  const logo = light ? brandLogos.reversed : brandLogos.primary;
  return (
    <Link to="/" className="inline-flex shrink-0 items-center">
      <img
        src={logo.src}
        alt="Kaushal Hub — Elevate Your Potential"
        width={logo.width}
        height={logo.height}
        className={light ? "h-12 w-auto max-w-[180px] object-contain" : "h-9 w-auto max-w-[134px] object-contain sm:h-10 sm:max-w-[150px]"}
      />
    </Link>
  );
}
export function LogoMark({ label, small }: { label: string; small?: boolean }) {
  return (
    <span className={cn("inline-flex items-center font-medium text-slate", small ? "text-[11px]" : "text-small")}>
      {label}
    </span>
  );
}
export function FittPill({ label = "In association with FITT, IIT Delhi" }: { label?: string }) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2">
      <img
        src={FITT_LOGO_SRC}
        alt="FITT, IIT Delhi"
        width={80}
        height={40}
        loading="lazy"
        className="h-8 w-auto max-w-[80px] object-contain"
      />
      <span className="text-small font-medium text-navy">{label}</span>
    </div>
  );
}

/* ---------- Navbar ---------- */
const links = [
  { to: "/programs", label: "Programs" },
  { to: "/resources", label: "Knowledge Library" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
const navLinkClass =
  "kh-nav-link rounded-sm text-[15px] text-ink outline-none transition-colors duration-300 hover:text-navy focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4";
export function Navbar({
  ctaLabel = "Apply Now",
  ctaTo = "/experience-to-enterprise",
  ctaHash = "application",
}: {
  ctaLabel?: string;
  ctaTo?: string;
  ctaHash?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Elevate the header once the page moves, and track reading progress, without re-rendering per frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty("--kh-progress", String(max > 0 ? Math.min(y / max, 1) : 0));
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
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow,border-color] duration-500 ease-brand",
        scrolled || open
          ? "border-border/80 bg-background/85 shadow-[0_1px_0_oklch(1_0_0/60%)_inset,0_10px_30px_-18px_oklch(0.27_0.07_257/35%)]"
          : "border-transparent bg-background/70",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-9 md:flex lg:gap-10">
          <ProgramsMenu />
          {links.slice(1).map((l) => (
            <Link key={l.to} to={l.to} className={navLinkClass} activeProps={{ className: "font-semibold text-navy" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <ButtonLink to={ctaTo} hash={ctaHash}>
            {ctaLabel}
          </ButtonLink>
        </div>
        <SiteButton
          variant="text"
          className="h-11 w-11 rounded-lg p-2 hover:bg-tint md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span key={open ? "close" : "open"} className="kh-drop inline-flex">
            {open ? <X /> : <Menu />}
          </span>
        </SiteButton>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="kh-drop max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-background/95 shadow-[0_24px_40px_-24px_oklch(0.27_0.07_257/40%)] md:hidden">
          <div className="container-site flex flex-col py-3">
            <MobileProgramsAccordion onNavigate={() => setOpen(false)} />
            {links.slice(1).map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{ "--kh-delay": `${110 + i * 50}ms` } as CSSProperties}
                className="kh-drop-item group flex items-center justify-between border-b py-4 text-navy transition-colors last:border-0 hover:text-ink"
                activeProps={{ className: "font-semibold" }}
              >
                {l.label}
                <ArrowRight className="h-4 w-4 text-slate transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </nav>
      )}
      {/* Reading progress */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px] overflow-hidden">
        <div ref={progressRef} className="kh-progress h-full bg-[linear-gradient(90deg,var(--color-saffron),oklch(0.8_0.13_75))]" />
      </div>
    </header>
  );
}

/**
 * Desktop "Programs" menu. The label still links to /programs; hovering the item, or
 * pressing the chevron, opens a panel with every program, Experience to Enterprise first.
 * A short close delay and a padded bridge keep it open while the pointer moves into it.
 */
function ProgramsMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };
  const close = () => {
    clearTimeout(closeTimer.current);
    setOpen(false);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      wrapRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center gap-1"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) hide();
      }}
    >
      <Link to="/programs" className={navLinkClass} activeProps={{ className: "font-semibold text-navy" }} onClick={close}>
        Programs
      </Link>
      <button
        type="button"
        aria-label="Show programs"
        aria-expanded={open}
        aria-controls="programs-menu"
        onClick={() => (open ? close() : show())}
        className={cn(
          "grid h-7 w-7 place-items-center rounded-md outline-none transition-colors duration-300 hover:bg-tint hover:text-navy focus-visible:ring-2 focus-visible:ring-navy",
          open ? "bg-tint text-navy" : "text-slate",
        )}
      >
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 ease-brand", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <div id="programs-menu" className="kh-drop absolute left-0 top-full z-50 w-[min(46rem,calc(100vw-3rem))] pt-5 lg:-left-24">
          <div className="grid overflow-hidden rounded-2xl border border-border/80 bg-card shadow-float lg:grid-cols-[18rem_1fr]">
            {/* Featured: Experience to Enterprise */}
            <Link
              to={featuredProgram.to}
              onClick={close}
              className="kh-surface-navy group/feat relative flex flex-col bg-navy p-6 text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-saffron">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden="true" />
                Featured program
              </span>
              <span className="mt-4 font-serif text-[24px] leading-8">{featuredProgram.title}</span>
              <span className="mt-1 font-serif text-[16px] italic leading-6 text-primary-foreground/85">{featuredProgram.tagline}</span>
              <span className="mt-3 text-small leading-5 text-primary-foreground/70">{featuredProgram.description}</span>
              <span className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-saffron">
                Explore the program
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover/feat:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            {/* Other programs */}
            <div className="flex flex-col p-3">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">More programs</p>
              <ul className="flex-1">
                {supportingPrograms.map(({ to, title, eligibility, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={close}
                      className="group/item flex items-start gap-3 rounded-xl p-3 outline-none transition-colors duration-200 hover:bg-tint/60 focus-visible:bg-tint/60"
                    >
                      <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-tint text-navy transition-colors duration-300 group-hover/item:bg-navy group-hover/item:text-primary-foreground">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-5 text-navy">{title}</span>
                        <span className="mt-1 block text-small leading-5 text-slate">{eligibility}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/programs"
                onClick={close}
                className="group/all mt-1 flex items-center justify-between rounded-xl border-t border-border/70 px-3 pb-2 pt-3 text-small font-semibold text-navy outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-navy"
              >
                View all programs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/all:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile: "Programs" expands in place to list every program, Experience to Enterprise first. */
function MobileProgramsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="kh-drop-item border-b" style={{ "--kh-delay": "60ms" } as CSSProperties}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="mobile-programs"
        className="flex w-full items-center justify-between py-4 text-left text-navy outline-none focus-visible:ring-2 focus-visible:ring-navy"
      >
        Programs
        <ChevronDown className={cn("h-4 w-4 text-slate transition-transform duration-300 ease-brand", expanded && "rotate-180")} aria-hidden="true" />
      </button>
      <Collapse open={expanded}>
        <div id="mobile-programs" className="space-y-2 pb-4">
          <Link
            to={featuredProgram.to}
            onClick={onNavigate}
            className="kh-surface-navy block rounded-xl bg-navy p-4 text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-saffron">Featured program</span>
            <span className="mt-1 block font-serif text-[19px] leading-6">{featuredProgram.title}</span>
            <span className="mt-1 block text-[13px] leading-5 text-primary-foreground/70">{featuredProgram.description}</span>
          </Link>
          <ul>
            {supportingPrograms.map(({ to, title, eligibility, icon: Icon }) => (
              <li key={to}>
                <Link to={to} onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-1 py-2.5 outline-none hover:bg-tint/60 focus-visible:ring-2 focus-visible:ring-navy">
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tint text-navy">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium leading-5 text-navy">{title}</span>
                    <span className="block text-[13px] text-slate">{eligibility}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/programs" onClick={onNavigate} className="flex items-center justify-between rounded-lg px-1 py-2 text-small font-semibold text-navy outline-none focus-visible:ring-2 focus-visible:ring-navy">
            View all programs <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Collapse>
    </div>
  );
}

export function StickyApply({
  ctaLabel = "Apply Now",
  ctaTo = "/experience-to-enterprise",
  ctaHash = "application",
}: {
  ctaLabel?: string;
  ctaTo?: string;
  ctaHash?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/85 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_30px_-20px_oklch(0.27_0.07_257/35%)] backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <ButtonLink to={ctaTo} hash={ctaHash} className="w-full">
        {ctaLabel}
      </ButtonLink>
    </div>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  const col = (title: string, items: { label: string; to: string; hash?: string }[]) => (
    <div>
      <p className="eyebrow !text-primary-foreground/60">{title}</p>
      <ul className="mt-4 space-y-2 text-[15px]">
        {items.map(({ label, to, hash }) => <li key={label}><Link to={to} {...(hash ? { hash } : {})} className="inline-block rounded-sm text-primary-foreground/85 outline-none transition-[color,transform] duration-300 ease-brand hover:translate-x-1 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:hover:translate-x-0">{label}</Link></li>)}
      </ul>
    </div>
  );
  const socialProfiles = [
    { name: "Facebook", Icon: Facebook },
    { name: "LinkedIn", Icon: Linkedin },
    { name: "Instagram", Icon: Instagram },
    { name: "YouTube", Icon: Youtube },
  ];
  return (
    <footer className="bg-brand-deep pb-24 pt-12 text-primary-foreground md:pb-8 md:pt-14">
      <div className="container-site">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0">
            <Logo light />
            <p className="mt-4 max-w-sm text-[15px] leading-6 text-primary-foreground/75">An initiative of SNN Eduworld Pvt. Ltd., connecting people with practical learning, useful knowledge and new opportunities.</p>
          </div>
          <div className="min-w-0">
            {col("Explore", [
              { label: "Programs", to: "/programs" },
              { label: "Experience to Enterprise", to: "/experience-to-enterprise" },
              { label: "Knowledge Library", to: "/resources" },
            ])}
          </div>
          <div className="min-w-0">
            {col("About", [
              { label: "About Kaushal Hub", to: "/about" },
              { label: "Community", to: "/community" },
              { label: "Contact Us", to: "/contact" },
            ])}
          </div>
          <div className="min-w-0">
            <p className="eyebrow !text-primary-foreground/60">Get in Touch</p>
            <address className="mt-4 not-italic text-[15px] leading-6 text-primary-foreground/85">
              <span className="block font-medium text-primary-foreground">Kaushal Hub</span>
              <span className="block">C-26, C Block, Sector 59</span>
              <span className="block">Noida, Uttar Pradesh 201309</span>
            </address>
            <a href="mailto:hello@kaushalhub.in" className="mt-2 block min-h-11 w-fit break-all text-[15px] text-primary-foreground/85 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep">hello@kaushalhub.in</a>
            <a href="tel:+919318497057" className="mt-2 block min-h-11 w-fit text-[15px] text-primary-foreground/85 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep">+91-9318497057</a>
            <a href="https://maps.app.goo.gl/PKSL1UK9TJZ1oJ5V9" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1 text-small text-primary-foreground/75 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep">
              Get Directions <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="mt-4">
              <p className="text-small font-medium text-primary-foreground/75">Social</p>
              <ul className="mt-2 flex items-center gap-4">
                {socialProfiles.map(({ name, Icon }) => (
                  <li key={name}>
                    <span role="img" aria-label={`${name}: no verified profile available`} className="inline-flex h-8 w-8 items-center justify-center text-primary-foreground/70">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/15 pt-5 text-small text-primary-foreground/65">
          <span>© 2026 SNN Eduworld Pvt. Ltd.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Layout primitives ---------- */
export function Section({ children, tint, white, className, id }: { children: ReactNode; tint?: boolean; white?: boolean; className?: string; id?: string }) {
  return <section id={id} className={cn("section-pad", tint ? "kh-surface-tint bg-tint" : white ? "bg-card" : "bg-background", className)}><div className="container-site">{children}</div></section>;
}
/** Shared surface for cards: hairline border, layered shadow and a calm hover response. */
export const cardSurface =
  "rounded-xl border border-border/80 bg-card shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-brand hover:border-navy/15 hover:shadow-lift motion-reduce:transition-none";
/** For cards that lead somewhere: they also rise slightly and reveal a saffron top edge. */
export const interactiveCardSurface = cn(
  cardSurface,
  "group relative overflow-hidden hover:-translate-y-1 motion-reduce:hover:translate-y-0",
  "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-[linear-gradient(90deg,var(--color-saffron),oklch(0.8_0.13_75))] before:transition-transform before:duration-500 before:ease-brand hover:before:scale-x-100 focus-within:before:scale-x-100",
);
export function SectionHeader({ eyebrow, title, sub, center, light }: { eyebrow?: string; title: string; sub?: ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && <p className={cn("eyebrow mb-4", light && "!text-saffron")}>{eyebrow}</p>}
      <h2 className={cn("h2", light && "!text-primary-foreground")}>{title}</h2>
      {sub && <p className={cn("mt-4", light ? "text-primary-foreground/75" : "text-slate")}>{sub}</p>}
    </div>
  );
}
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(cardSurface, "p-6 md:p-8", className)}>{children}</div>;
}
export function FactTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className={cn(cardSurface, "relative overflow-hidden p-5 md:p-6 before:absolute before:left-0 before:top-5 before:h-6 before:w-[3px] before:rounded-r before:bg-saffron md:before:top-6")}>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-[20px] leading-7 text-navy">{value}</p>
      {note && <p className="mt-2 text-small text-slate">{note}</p>}
    </div>
  );
}
export function Tag({ children, tone = "tint" }: { children: ReactNode; tone?: "tint" | "saffron" }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-medium", tone === "tint" ? "bg-tint text-navy" : "bg-saffron/15 text-navy")}>{tone === "saffron" && <span className="h-1.5 w-1.5 rounded-full bg-saffron" />}{children}</span>;
}
export function CheckItem({ children }: { children: ReactNode }) {
  return <li className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-navy" strokeWidth={2} /><span>{children}</span></li>;
}
/** Internal review labels are hidden from the public site. */
export function WorkingCopy(_props: { children?: ReactNode }) {
  return null;
}

/* ---------- Brochure (shown only when a real file URL is set) ---------- */
export const BROCHURE_URL = "";
export function BrochureLink({ variant = "secondary", className }: { variant?: Variant; className?: string }) {
  if (!BROCHURE_URL) return null;
  return <a href={BROCHURE_URL} download className={buttonClass(variant, className)}>Download Brochure</a>;
}

/* ---------- Accordion ---------- */
export function Accordion({ items }: { items: { q: ReactNode; a: ReactNode; key?: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y overflow-hidden rounded-xl border border-border/80 bg-card shadow-card">
      {items.map((it, i) => (
        <div key={it.key ?? i} className={cn("relative transition-colors duration-300", open === i && "bg-tint/35")}>
          {/* Saffron marker for the open item */}
          <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-[3px] origin-top bg-saffron transition-transform duration-500 ease-brand", open === i ? "scale-y-100" : "scale-y-0")} />
          <button onClick={() => setOpen(open === i ? null : i)} className="group flex w-full items-center justify-between gap-4 p-5 text-left outline-none transition-colors duration-300 hover:bg-tint/40 focus-visible:bg-tint/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy md:p-6" aria-expanded={open === i}>
            <span className="h4 font-serif text-navy">{it.q}</span>
            <span aria-hidden="true" className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 ease-brand", open === i ? "border-navy bg-navy text-primary-foreground" : "border-border bg-card text-navy group-hover:border-navy/40")}>
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 ease-brand", open === i && "rotate-180")} />
            </span>
          </button>
          <Collapse open={open === i}>
            <div className="px-5 pb-6 text-slate md:px-6">{it.a}</div>
          </Collapse>
        </div>
      ))}
    </div>
  );
}

/**
 * Animates height open and closed with a grid-rows transition (no measuring, no library).
 * Closed content stays mounted but is inert and hidden from assistive technology.
 */
export function Collapse({ open, children, className }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-500 ease-brand motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/* ---------- Step ---------- */
export function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy bg-card font-serif text-navy shadow-card">{n}</span>
      <div><p className="font-semibold text-navy">{title}</p><p className="mt-1 text-small text-slate">{text}</p></div>
    </div>
  );
}

/* ---------- Form field ---------- */
const inputCls = "mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-[16px] text-ink shadow-[inset_0_1px_2px_oklch(0.27_0.07_257/4%)] outline-none transition-[border-color,box-shadow] duration-300 ease-brand hover:border-navy/30 focus:border-navy focus:shadow-[0_0_0_4px_oklch(0.27_0.07_257/10%)]";
export function Field({ label, name, type = "text", required, as, options, placeholder }: { label: string; name: string; type?: string; required?: boolean; as?: "textarea" | "select"; options?: string[]; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-small font-medium text-ink">{label}{required && " *"}</span>
      {as === "textarea" ? <textarea name={name} required={required} rows={4} placeholder={placeholder} className={inputCls} />
        : as === "select" ? <select name={name} required={required} className={inputCls} defaultValue=""><option value="" disabled>Select</option>{options?.map((o) => <option key={o}>{o}</option>)}</select>
        : <input name={name} type={type} required={required} placeholder={placeholder} className={inputCls} />}
    </label>
  );
}

/* ---------- Shared KH-level blocks ---------- */
export const areas: [string, string][] = [
  ["Practical learning", "Programs built around useful skills and application."],
  ["Emerging technology", "Learning connected to technologies changing how people work and build."],
  ["Entrepreneurship", "Practical routes for people exploring ventures."],
  ["Experts & industry", "Connecting learners with practitioners and real-world contexts."],
  ["Community", "A network of learners, alumni and experts."],
];
export function WhatWeDo() {
  return (
    <div className="grid gap-x-8 gap-y-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-5">
      {areas.map(([t, d], i) => (
        <div key={t}>
          <p className="font-serif text-small text-slate">0{i + 1}</p>
          <p className="eyebrow mt-3 !text-navy">{t}</p>
          <p className="mt-3 text-[16px] leading-6 text-slate">{d}</p>
        </div>
      ))}
    </div>
  );
}
export const principles = ["Practical over theoretical", "Evidence over assumption", "Expertise shared openly", "Progress measured by application"];
export function VisionMission() {
  return (
    <Section white>
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">Our vision and mission</p>
        <h2 className="h2 mt-6">A world where useful knowledge leads to meaningful action.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate">A future in which people can access credible knowledge, build practical capabilities and pursue opportunities with greater clarity and confidence.</p>
        <div className="mx-auto my-10 h-px w-16 bg-saffron" />
        <p className="eyebrow !text-navy">Our mission</p>
        <p className="h4 mx-auto mt-4 max-w-3xl font-serif text-navy">To make practical knowledge accessible, connect learning with real-world application, and create pathways for people to develop their capabilities and act on new opportunities.</p>
      </div>
      <div className="mx-auto mt-16 max-w-5xl">
        <p className="eyebrow text-center">How we work</p>
        <div className="mt-6 grid grid-cols-2 border-y md:grid-cols-4">
          {principles.map((p, i) => <p key={p} className={cn("p-5 text-center font-serif text-[18px] text-navy transition-colors duration-300 hover:bg-tint/50", i > 0 && "md:border-l", i % 2 === 1 && "border-l")}>{p}</p>)}
        </div>
      </div>
    </Section>
  );
}
export function PeopleGrid({ n = 4, note }: { n?: number; note?: string }) {
  return (
    <>
      <div className={cn("grid grid-cols-2 gap-4 md:gap-6", n === 3 ? "md:grid-cols-3" : "md:grid-cols-4")}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card">
            <div className="grid aspect-[4/5] place-items-center bg-tint text-small text-slate">[PLACEHOLDER photo]</div>
            <div className="p-4">
              <p className="font-serif text-[18px] text-navy">[PLACEHOLDER name]</p>
              <p className="text-small text-slate">Role, Organisation</p>
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-6 text-small text-slate">{note}</p>}
    </>
  );
}
export function CtaBand({ title, text, primary, secondary, brochure }: { title: string; text?: string; primary: [string, string]; secondary?: [string, string]; brochure?: boolean }) {
  return (
    <section className="kh-surface-navy section-pad bg-navy">
      <div className="container-site flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between" data-kh-reveal-group>
        <div className="max-w-xl">
          <h2 className="h2 !text-primary-foreground">{title}</h2>
          {text && <p className="mt-4 text-primary-foreground/75">{text}</p>}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink to={primary[1]}>{primary[0]}</ButtonLink>
          {brochure && <BrochureLink variant="inverse" />}
          {secondary && <ButtonLink to={secondary[1]} variant="inverse">{secondary[0]}</ButtonLink>}
        </div>
      </div>
    </section>
  );
}
export const SiteCta = () => <CtaBand title="Let’s help you take your next step." text="Explore practical learning programs, discover useful knowledge or connect with us to discuss an idea, opportunity or collaboration." primary={["Explore Programs", "/programs"]} secondary={["Get in Touch", "/contact"]} />;

/* ---------- Associations strip ---------- */
export function AssociationsStrip({ note = "Experience to Enterprise is a Kaushal Hub program offered in association with FITT, IIT Delhi." }: { label?: string; note?: ReactNode }) {
  return (
    <div className="border-y bg-card py-5">
      <div className="container-site flex flex-wrap items-center gap-x-4 gap-y-3">
        <img
          src={FITT_LOGO_SRC}
          alt="FITT, IIT Delhi"
          width={80}
          height={40}
          loading="lazy"
          className="h-8 w-auto max-w-[80px] object-contain"
        />
        <p className="text-small text-slate">{note}</p>
      </div>
    </div>
  );
}

/* ---------- Program card ---------- */
export function ProgramCard({ program }: { program: Pick<Program, "path" | "metadata" | "title" | "description"> }) {
  return (
    <article className={cn(interactiveCardSurface, "flex h-full min-w-0 flex-col p-6 md:p-7")}>
      <h4 className="h4 break-words font-serif text-navy transition-colors duration-300 group-hover:text-ink">{program.title}</h4>
      <div className="mt-4 space-y-1 text-small text-slate">
        {program.metadata.map((item) => (
          <p key={item.label}><span className="font-semibold text-ink">{item.label}:</span> {item.value}</p>
        ))}
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-6 text-slate">{program.description}</p>
      <div className="mt-6">
        <ButtonLink to={program.path} variant="text">
          View Program
        </ButtonLink>
      </div>
    </article>
  );
}

export function ImpactLine({ className }: { className?: string }) {
  return <p className={cn("font-serif text-[20px] italic leading-8 text-navy md:text-[24px] md:leading-9", className)}>In 12 weeks, go from a domain insight to a customer-tested venture, a financial model and an investor-ready pitch.</p>;
}

/* ---------- Signature feature ---------- */
export function SignatureFeature({ title, body, footnote }: { title: string; body: string; footnote: string }) {
  return (
    <div className={cn(cardSurface, "border-navy/70 p-6 md:p-8")}>
      <p className="eyebrow">Signature feature</p>
      <h3 className="h3 mt-4">{title}</h3>
      <p className="mt-4 text-slate">{body}</p>
      <p className="mt-6 border-t pt-4 text-small text-slate">{footnote}</p>
    </div>
  );
}
