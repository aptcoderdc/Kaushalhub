import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Linkedin, UserRound } from "lucide-react";
import { Section, SectionHeader, SiteButton } from "@/components/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/public-asset";
import type { FacultyMember } from "@/lib/faculty";

export function FacultySection({
  faculty,
  tint,
  white,
  id,
  eyebrow,
  className,
}: {
  faculty: FacultyMember[];
  tint?: boolean;
  white?: boolean;
  id?: string;
  eyebrow?: string;
  className?: string;
}) {
  if (faculty.length === 0) return null;

  return (
    <Section {...(tint ? { tint } : {})} {...(white ? { white } : {})} {...(id ? { id } : {})} {...(className ? { className } : {})}>
      <SectionHeader
        {...(eyebrow ? { eyebrow } : {})}
        title="Meet Your Faculty"
        sub="Learn from experienced professionals and subject-matter experts who bring practical knowledge and real-world perspectives to the learning experience."
      />
      <FacultyCarousel faculty={faculty} />
    </Section>
  );
}

/**
 * Shows three cards on desktop, two on tablet and one on mobile. Visitors move through
 * the rest with the arrows or by swiping; arrows hide when every card already fits.
 */
function FacultyCarousel({ faculty }: { faculty: FacultyMember[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ prev: false, next: faculty.length > 1 });

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScroll({ prev: track.scrollLeft > 1, next: track.scrollLeft < maxScroll - 1 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArrows();
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updateArrows);
    resizeObserver?.observe(track);
    track.addEventListener("scroll", updateArrows, { passive: true });
    return () => {
      resizeObserver?.disconnect();
      track.removeEventListener("scroll", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const showArrows = canScroll.prev || canScroll.next;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Faculty profiles"
      className="mt-8 grid grid-cols-2 items-center gap-x-3 gap-y-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-4"
    >
      <ul
        ref={trackRef}
        className="col-span-2 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:order-2 md:col-span-1 [&::-webkit-scrollbar]:hidden"
      >
        {faculty.map((member) => (
          <li
            key={member.name}
            className="w-full shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <FacultyCard member={member} />
          </li>
        ))}
      </ul>
      {showArrows && (
        <>
          <CarouselArrow
            direction="prev"
            disabled={!canScroll.prev}
            onClick={() => scrollByCard(-1)}
            className="justify-self-end md:order-1"
          />
          <CarouselArrow
            direction="next"
            disabled={!canScroll.next}
            onClick={() => scrollByCard(1)}
            className="justify-self-start md:order-3"
          />
        </>
      )}
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous faculty profiles" : "Next faculty profiles"}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full border border-navy bg-card text-navy shadow-card transition-[background-color,color,transform] duration-300 ease-brand hover:-translate-y-0.5 hover:bg-navy hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-border disabled:text-navy/30 disabled:shadow-none disabled:hover:bg-card disabled:hover:text-navy/30",
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function FacultyCard({ member }: { member: FacultyMember }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-brand hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative p-2.5 pb-0">
        <FacultyPhoto
          member={member}
          className="aspect-[4/3] rounded-xl sm:aspect-square"
          imageClassName="transition-transform duration-[900ms] ease-brand group-hover:scale-[1.04] motion-reduce:transition-none"
          loading="lazy"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-2.5 bottom-0 h-16 rounded-b-xl bg-gradient-to-t from-navy/25 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="h4 font-serif text-navy">{member.name}</h3>
          <LinkedInButton member={member} />
        </div>
        <p className="mt-1.5 text-small font-semibold leading-5 text-saffron-ink">{member.designation}</p>
        <p className="mt-4 flex-1 border-t border-border/70 pt-4 text-[15px] leading-6 text-slate">
          {member.shortBio}
        </p>
        <FacultyDialog member={member} />
      </div>
    </article>
  );
}

function FacultyDialog({ member }: { member: FacultyMember }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SiteButton
          variant="text"
          className="mt-5 self-start"
          aria-label={`Read more about ${member.name}`}
        >
          Read More
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </SiteButton>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-y-auto rounded-2xl border-border/80 bg-card p-0 shadow-float">
        <div className="grid gap-5 border-b p-5 pr-12 sm:grid-cols-[160px_1fr] sm:items-center sm:p-6 sm:pr-12">
          <FacultyPhoto
            member={member}
            className="aspect-square w-32 rounded-lg border sm:w-full"
          />
          <div>
            <DialogTitle className="font-serif text-[22px] font-medium leading-[30px] text-navy md:text-[28px] md:leading-9">
              {member.name}
            </DialogTitle>
            <DialogDescription className="mt-2 text-small font-medium text-slate">
              {member.designation}
            </DialogDescription>
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-navy hover:underline"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border bg-card">
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </span>
                View LinkedIn Profile
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h4 className="eyebrow">About</h4>
          <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate">
            {member.fullBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FacultyPhoto({
  member,
  className,
  imageClassName,
  loading,
}: {
  member: FacultyMember;
  className?: string;
  imageClassName?: string;
  loading?: "lazy";
}) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-navy/5", className)}>
      {member.photo && !photoFailed ? (
        <img
          src={publicAsset(member.photo)}
          alt={`Portrait of ${member.name}`}
          {...(loading ? { loading } : {})}
          onError={() => setPhotoFailed(true)}
          className={cn("h-full w-full object-cover object-top", imageClassName)}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center"
          role="img"
          aria-label={`Portrait of ${member.name} unavailable`}
        >
          <UserRound className="h-1/3 w-1/3 text-navy/25" strokeWidth={1.25} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function LinkedInButton({ member }: { member: FacultyMember }) {
  const badge =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-card text-navy shadow-sm";

  // Without a verified URL, keep the icon as a non-clickable placeholder.
  if (!member.linkedinUrl) {
    return (
      <span className={cn(badge, "opacity-50")} aria-hidden="true">
        <Linkedin className="h-4 w-4" />
      </span>
    );
  }

  return (
    <a
      href={member.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
      className={cn(badge, "transition-colors hover:bg-navy hover:text-primary-foreground")}
    >
      <Linkedin className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
