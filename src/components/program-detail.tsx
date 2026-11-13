import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  GraduationCap,
  IndianRupee,
  Info,
  Landmark,
  Laptop,
  Lightbulb,
  MapPin,
  Rocket,
  Sparkles,
  Target,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink, Section, SectionHeader, cardSurface } from "@/components/site";
import { FacultySection } from "@/components/faculty-section";
import type { Program, ProgramSection } from "@/lib/programs";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

const CAMPUS_IMAGE = publicAsset("/images/fitt-iit-delhi-campus.webp");

/** Background used by each content section, so the faculty section can avoid matching its neighbour. */
const sectionTone: Record<ProgramSection["kind"], "tint" | "white" | "default"> = {
  learning: "white",
  journey: "tint",
  campus: "white",
  audience: "default",
  structure: "tint",
  outcomes: "white",
  venue: "default",
};

/** Icons for the program facts, by label. Unknown labels get a neutral icon. */
const detailIcons: Record<string, LucideIcon> = {
  Duration: Clock,
  "Program fee": IndianRupee,
  Eligibility: Users,
  Format: Laptop,
  "Campus immersion": Landmark,
  Location: MapPin,
  Date: CalendarDays,
};

const topicIcons: LucideIcon[] = [Lightbulb, Target, Users, Rocket, Sparkles, BadgeCheck];
const audienceIcons: LucideIcon[] = [GraduationCap, Laptop, Rocket, UserRound];

export function ProgramDetail({ program }: { program: Program }) {
  // Faculty follows the "Who is this program for" section, or closes the content if there is none.
  const audienceIndex = program.sections.findIndex((section) => section.kind === "audience");
  const facultyIndex = audienceIndex === -1 ? program.sections.length : audienceIndex + 1;
  const nextSection = program.sections[facultyIndex];
  const eligibility = program.details.find((detail) => detail.label === "Eligibility")?.value;

  return (
    <>
      {/* Hero */}
      <section data-hero className="relative isolate overflow-hidden pb-12 pt-8 md:pb-16 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[32rem] w-[32rem] rounded-full bg-navy/10 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />

        <div className="container-site relative">
          <Link
            to="/programs"
            className="kh-rise group inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold text-navy outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-navy"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:-translate-x-1" aria-hidden="true" />
            All Programs
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              {eligibility && (
                <p className="kh-rise inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-card px-3 py-1 text-[13px] font-semibold text-saffron-ink shadow-card [--kh-delay:40ms]">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {eligibility}
                </p>
              )}
              <h1 className="h1 kh-rise mt-5 text-balance [--kh-delay:90ms]">{program.title}</h1>
              <p className="kh-rise mt-5 font-serif text-[22px] leading-8 text-navy [--kh-delay:150ms] md:text-[26px] md:leading-9">
                <span className="kh-accent">{program.subtitle}</span>
              </p>
              <p className="kh-rise mt-5 max-w-2xl text-slate [--kh-delay:210ms]">{program.pageDescription ?? program.description}</p>
              <p role="status" className="kh-rise mt-6 flex items-start gap-2 text-small font-medium text-navy [--kh-delay:260ms]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-saffron-ink" aria-hidden="true" />
                {program.heroNotice}
              </p>
              <div className="kh-rise mt-8 flex flex-col gap-3 [--kh-delay:320ms] sm:flex-row">
                <ButtonLink to="/contact">Get in Touch</ButtonLink>
                <ButtonLink to="/programs" variant="secondary">Explore all programs</ButtonLink>
              </div>
            </div>
            <figure className="kh-rise-card relative [--kh-delay:220ms] lg:col-span-5">
              <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-3xl border border-saffron/40 bg-saffron/10 sm:block" />
              <img
                src={CAMPUS_IMAGE}
                alt="The Foundation for Innovation and Technology Transfer building at IIT Delhi"
                width={1474}
                height={1100}
                className="relative aspect-[4/3] w-full rounded-3xl object-cover object-left-bottom shadow-float"
              />
            </figure>
          </div>

          {/* Program facts */}
          <dl
            className={cn(
              "kh-rise mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/70 shadow-lift [--kh-delay:380ms] sm:grid-cols-2",
              program.details.length >= 5 ? "lg:grid-cols-5" : program.details.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
            )}
          >
            {program.details.map(({ label, value }, i) => {
              const Icon = detailIcons[label] ?? Info;
              return (
                <div
                  key={label}
                  className={cn(
                    "flex gap-3 bg-card p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklch,var(--color-tint)_45%,var(--color-card))]",
                    i === program.details.length - 1 && program.details.length % 2 === 1 && "sm:col-span-2 lg:col-span-1",
                  )}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-saffron-ink" strokeWidth={1.75} aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="eyebrow !text-[11px]">{label}</dt>
                    <dd className="mt-1.5 font-serif text-[17px] leading-6 text-navy">{value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {program.sections.slice(0, facultyIndex).map((section, index) => (
        <ProgramContentSection key={`${section.kind}-${index}`} section={section} />
      ))}

      {nextSection && sectionTone[nextSection.kind] === "tint" ? (
        <FacultySection faculty={program.faculty} white />
      ) : (
        <FacultySection faculty={program.faculty} tint />
      )}

      {program.sections.slice(facultyIndex).map((section, index) => (
        <ProgramContentSection key={`${section.kind}-${facultyIndex + index}`} section={section} />
      ))}

      {/* Closing */}
      <section className="bg-background py-12 md:py-16">
        <div className="container-site">
          <div className="kh-surface-navy relative overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-center shadow-float sm:px-10 md:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-saffron/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow !text-saffron">HAVE A QUESTION?</p>
              <p className="mt-4 font-serif text-[20px] leading-8 text-primary-foreground md:text-[24px] md:leading-9">{program.finalNotice}</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink to="/contact">Get in Touch</ButtonLink>
                <ButtonLink to="/programs" variant="inverse">Explore all programs</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground", className)}>
      <Icon className="h-6 w-6" strokeWidth={1.5} />
    </span>
  );
}

function ProgramContentSection({ section }: { section: ProgramSection }) {
  if (section.kind === "learning") {
    return (
      <Section white>
        <SectionHeader eyebrow="Learning focus" title={section.title} />
        <div className={cn("mt-10 grid gap-5", section.columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
          {section.items.map((item, i) => (
            <article key={item.title} className={cn(cardSurface, "group relative overflow-hidden p-6 hover:-translate-y-1 motion-reduce:hover:translate-y-0 md:p-7")}>
              <div className="flex items-start justify-between gap-4">
                <IconTile icon={topicIcons[i % topicIcons.length] ?? Lightbulb} />
                <span aria-hidden="true" className="font-serif text-[28px] leading-none text-navy/12">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="h4 mt-5 font-serif text-navy">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-slate">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    );
  }

  if (section.kind === "journey") {
    return (
      <Section tint>
        <SectionHeader eyebrow="Program journey" title={section.title} />
        <p className="mt-4 flex max-w-3xl items-start gap-2 text-small text-slate">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {section.note}
        </p>
        <ol className={cn("relative mt-12 grid gap-8 sm:grid-cols-2", section.steps.length >= 6 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
          {section.steps.map((step, index) => (
            <li key={step.period} className="group relative">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-navy bg-card font-serif text-[16px] text-navy shadow-card transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                  {index + 1}
                </span>
                <span aria-hidden="true" className="h-0.5 flex-1 bg-gradient-to-r from-navy/30 to-transparent" />
              </div>
              <p className="eyebrow mt-5 !text-saffron-ink">{step.period}</p>
              <h3 className="h4 mt-2 font-serif text-navy">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-slate">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  if (section.kind === "campus") {
    return (
      <Section white>
        <div className="kh-surface-navy grid items-center gap-8 overflow-hidden rounded-3xl bg-navy p-7 shadow-float sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
          <div className="lg:col-span-7">
            <p className="eyebrow !text-saffron">Campus immersion</p>
            <h2 className="h2 mt-4 text-balance !text-primary-foreground">{section.title}</h2>
            <p className="mt-4 max-w-2xl text-primary-foreground/80">{section.body}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5 backdrop-blur">
              <img src={CAMPUS_IMAGE} alt="" aria-hidden="true" width={96} height={72} loading="lazy" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
              <div>
                <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-saffron">
                  <Landmark className="h-3.5 w-3.5" aria-hidden="true" /> IIT Delhi
                </p>
                <p className="mt-1 font-serif text-[18px] leading-6 text-primary-foreground">In-person campus experience</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (section.kind === "audience") {
    return (
      <Section>
        <SectionHeader eyebrow="Audience" title={section.title} />
        {section.body && !section.groups && (
          <div className="relative mt-8 max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-card md:p-9">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-saffron to-saffron/30" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <IconTile icon={UserRound} className="bg-navy text-primary-foreground" />
              <p className="font-serif text-[19px] leading-8 text-ink md:text-[21px] md:leading-9">{section.body}</p>
            </div>
          </div>
        )}
        {section.body && section.groups && <p className="mt-5 max-w-3xl text-slate">{section.body}</p>}
        {section.groups && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.groups.map((group, i) => (
              <article key={group.title} className={cn(cardSurface, "group p-6 hover:-translate-y-1 motion-reduce:hover:translate-y-0 md:p-7")}>
                <IconTile icon={audienceIcons[i % audienceIcons.length] ?? Users} />
                <h3 className="h4 mt-5 font-serif text-navy">{group.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-slate">{group.description}</p>
              </article>
            ))}
          </div>
        )}
      </Section>
    );
  }

  if (section.kind === "structure") {
    return (
      <Section tint>
        <SectionHeader eyebrow="Program structure" title={section.title} />
        <ol className="relative mt-10 max-w-5xl">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.35rem] top-6 w-0.5 bg-gradient-to-b from-navy via-navy/30 to-saffron" />
          {section.items.map((item, index) => (
            <li key={item.title} className="group relative pb-5 pl-16 last:pb-0">
              <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border-2 border-navy bg-card font-serif text-[16px] text-navy shadow-card transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={cn(cardSurface, "grid gap-2 p-5 md:grid-cols-12 md:gap-6 md:p-6")}>
                <h3 className="h4 font-serif text-navy md:col-span-4 md:self-start">{item.title}</h3>
                <p className="text-[15px] leading-6 text-slate md:col-span-8">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  if (section.kind === "outcomes") {
    return (
      <Section white>
        <SectionHeader eyebrow="Outcomes" title={section.title} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <li key={item} className={cn(cardSurface, "group flex items-start gap-4 p-5")}>
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron/15 text-saffron-ink transition-colors duration-300 group-hover:bg-saffron group-hover:text-navy">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  return (
    <Section>
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Venue</p>
          <h2 className="h2 mt-4 text-balance">{section.title}</h2>
          <p className="mt-4 text-slate">{section.body}</p>
        </div>
        <ul className={cn(cardSurface, "divide-y divide-border/70 lg:col-span-7")}>
          {section.details.map((detail) => (
            <li key={detail} className="flex items-start gap-4 p-5">
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tint text-navy">
                <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="pt-1.5 text-ink">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
