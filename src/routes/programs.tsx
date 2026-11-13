import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Clock, Landmark, type LucideIcon } from "lucide-react";
import workshop from "@/assets/workshop.webp";
import { ButtonLink, FittPill, Section, interactiveCardSurface } from "@/components/site";
import { canonicalLinks } from "@/lib/resources";
import { supportingPrograms } from "@/lib/program-nav";
import { cn } from "@/lib/utils";

const featuredFacts: [LucideIcon, string][] = [
  [Clock, "12 weeks"],
  [CalendarClock, "~10 hours per week"],
  [Landmark, "Online + campus immersion at IIT Delhi"],
];

export const Route = createFileRoute("/programs")({
  head: ({ matches }) => ({
    meta: [
      { title: "Programs — Kaushal Hub" },
      {
        name: "description",
        content:
          "Practical programs designed around capability, opportunity and real-world application.",
      },
      { property: "og:title", content: "Programs — Kaushal Hub" },
      {
        property: "og:description",
        content:
          "Practical programs designed around capability, opportunity and real-world application.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: matches.some((match) => String(match.routeId) === "/programs/$programSlug")
      ? []
      : canonicalLinks("/programs"),
  }),
  component: Programs,
});

function Programs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/programs" && pathname !== "/programs/") {
    return <Outlet />;
  }

  return (
    <>
      <section data-hero className="relative isolate overflow-hidden pb-10 pt-12 md:pb-14 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-navy/10 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <p className="eyebrow kh-rise flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />
            OUR PROGRAMS
          </p>
          <h1 className="h1 kh-rise mt-5 max-w-4xl text-balance [--kh-delay:80ms] md:!text-[52px] md:!leading-[60px]">
            Find the right program for what you want to build.
          </h1>
          <p className="kh-rise mt-5 max-w-2xl text-slate [--kh-delay:160ms]">
            Practical programs for experienced professionals, students and people exploring emerging
            technologies.
          </p>
        </div>
      </section>

      <Section tint className="!pt-10 md:!pt-14">
        {/* Featured program */}
        <p className="eyebrow mb-4">FEATURED PROGRAM</p>
        <article className="kh-surface-navy group grid overflow-hidden rounded-3xl bg-navy text-primary-foreground shadow-float lg:grid-cols-12">
          <div className="relative min-h-56 overflow-hidden lg:col-span-5">
            <img
              src={workshop}
              alt="Professionals working through a problem together"
              width={1280}
              height={960}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.04] motion-reduce:transition-none"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-navy/40" />
            <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-small font-medium text-green-700">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-green-600" />
              </span>
              ENROLLING NOW
            </span>
          </div>
          <div className="p-6 md:p-10 lg:col-span-7">
            <h2 className="h2 !text-primary-foreground">Experience to Enterprise</h2>
            <p className="mt-2 font-serif text-[20px] italic leading-7 text-saffron">Test the leap before you take it.</p>
            <p className="mt-4 text-primary-foreground/80">
              A 12-week venture-building program for experienced professionals exploring
              entrepreneurship.
            </p>
            <div className="mt-5 w-fit rounded-2xl bg-card px-3 py-2 sm:rounded-full sm:py-1.5"><FittPill /></div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {featuredFacts.map(([Icon, fact]) => (
                <li key={fact} className="flex items-start gap-2.5 rounded-xl border border-primary-foreground/12 bg-primary-foreground/[0.06] p-3 text-small font-medium leading-5 text-primary-foreground/90">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/experience-to-enterprise" hash="application">
                Apply Now
              </ButtonLink>
              <ButtonLink to="/experience-to-enterprise" variant="inverse">
                View Program
              </ButtonLink>
            </div>
          </div>
        </article>

        {/* Other programs */}
        <p className="eyebrow mb-4 mt-14">EXPLORE OUR PROGRAMS</p>
        <ul className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {supportingPrograms.map(({ to, title, description, metadata, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={cn(interactiveCardSurface, "flex h-full flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 md:p-7")}
              >
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="h4 mt-5 font-serif text-navy">{title}</h3>
                <div className="mt-3 space-y-1 text-small text-slate">
                  {metadata.map((item) => (
                    <p key={item.label}><span className="font-semibold text-ink">{item.label}:</span> {item.value}</p>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-6 text-slate">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-navy">
                  View Program
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
