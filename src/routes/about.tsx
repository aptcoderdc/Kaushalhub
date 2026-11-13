import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Eye,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Quote,
  Rocket,
  Target,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import discussion from "@/assets/discussion.webp";
import { ButtonLink, Section, SectionHeader, areas, cardSurface, interactiveCardSurface } from "@/components/site";
import { cn } from "@/lib/utils";
import { canonicalLinks } from "@/lib/resources";
import { organisationLogos } from "@/lib/organisation-logos";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Kaushal Hub — An initiative of SNN Eduworld" },
      {
        name: "description",
        content:
          "An initiative of SNN Eduworld Pvt. Ltd., Kaushal Hub brings together practical learning, emerging technologies, entrepreneurship and a community built around knowledge and opportunity.",
      },
      { property: "og:title", content: "About Kaushal Hub" },
      {
        property: "og:description",
        content:
          "Practical learning, emerging technologies, entrepreneurship and a community built around knowledge and opportunity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks("/about"),
  }),
  component: About,
});

const areaIcons: LucideIcon[] = [Lightbulb, Cpu, Rocket, UsersRound, HeartHandshake];

const pillars: { icon: LucideIcon; title: string; text: string; to: string; cta: string }[] = [
  {
    icon: GraduationCap,
    title: "Programs",
    text: "Structured learning initiatives for different audiences and stages of development.",
    to: "/programs",
    cta: "Explore Programs",
  },
  {
    icon: BookOpen,
    title: "Knowledge Library",
    text: "Practical articles and guides to help people understand problems, test ideas and make better decisions.",
    to: "/resources",
    cta: "Explore the Knowledge Library",
  },
  {
    icon: UsersRound,
    title: "Community",
    text: "A space to connect with people who are learning, building, sharing expertise and exploring opportunities.",
    to: "/community",
    cta: "Join the Community",
  },
];

function About() {
  return (
    <>
      {/* Hero */}
      <section data-hero className="relative isolate overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-16 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-navy/10 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
        <div className="container-site relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow kh-rise flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-saffron" />
              An initiative of SNN Eduworld Pvt. Ltd.
            </p>
            <h1 className="h1 kh-rise mt-5 [--kh-delay:80ms]">About Kaushal Hub</h1>
            <p className="kh-rise mt-6 max-w-2xl text-[17px] leading-8 text-slate [--kh-delay:160ms] md:text-[19px]">
              An initiative of SNN Eduworld Pvt. Ltd., Kaushal Hub brings together practical
              learning, emerging technologies, entrepreneurship and a community built around
              knowledge and opportunity.
            </p>
            <div className="kh-rise mt-8 flex flex-col gap-3 [--kh-delay:240ms] sm:flex-row">
              <ButtonLink to="/programs">Explore Programs</ButtonLink>
              <ButtonLink to="/contact" variant="secondary">Get in Touch</ButtonLink>
            </div>
          </div>
          <div className="kh-rise-card relative [--kh-delay:200ms] lg:col-span-6">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-3xl border border-saffron/40 bg-saffron/10 sm:block" />
            <img
              src={discussion}
              alt="Two professionals in discussion"
              width={1280}
              height={960}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-float"
            />
          </div>
        </div>
      </section>

      {/* Supporters */}
      <Section tint>
        <SectionHeader title="Backed & Supported By" />
        <ul className="mt-8 grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4">
          {organisationLogos.map(({ name, src }) => (
            <li
              key={name}
              className="group flex min-h-32 min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card px-3 py-5 text-center shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-brand hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <img
                src={src}
                alt={name}
                width={180}
                height={60}
                loading="lazy"
                className="h-12 w-full max-w-[180px] object-contain transition-transform duration-500 ease-brand group-hover:scale-105 motion-reduce:transition-none"
              />
              <span className="text-small font-medium text-navy">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Who we are */}
      <Section white>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">Who we are</p>
            <h2 className="h2 text-balance">An organisation for practical learning.</h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-slate">
              Kaushal Hub is an initiative of SNN Eduworld Pvt. Ltd. We develop learning programs,
              connect expertise with practical challenges, and create opportunities for people to
              explore new capabilities and ideas.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="kh-surface-navy relative overflow-hidden rounded-3xl bg-navy p-8 shadow-float md:p-10">
              <Quote aria-hidden="true" className="h-9 w-9 text-saffron" strokeWidth={1.25} />
              <p
                lang="hi"
                className="mt-4 text-[28px] font-medium leading-10 text-primary-foreground md:text-[34px] md:leading-[46px]"
                style={{ fontFamily: '"Noto Sans Devanagari", "Kohinoor Devanagari", system-ui, sans-serif' }}
              >
                कौशल से कुशल भारत
              </p>
              <p className="mt-2 text-small text-primary-foreground/70">
                From individual capability to a more capable India.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* What we do */}
      <Section tint>
        <SectionHeader eyebrow="What we do" title="Five areas we work across." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {areas.map(([title, text], i) => {
            const Icon = areaIcons[i] ?? Lightbulb;
            return (
              <li key={title} className={cn(cardSurface, "group flex flex-col p-6 hover:-translate-y-1 motion-reduce:hover:translate-y-0", i === areas.length - 1 && "sm:col-span-2 lg:col-span-1")}>
                <div className="flex items-center justify-between">
                  <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span aria-hidden="true" className="font-serif text-[24px] leading-none text-navy/12">0{i + 1}</span>
                </div>
                <h3 className="eyebrow mt-6 !text-navy">{title}</h3>
                <p className="mt-3 text-[15px] leading-6 text-slate">{text}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Ecosystem */}
      <Section white>
        <div className="max-w-4xl">
          <p className="eyebrow mb-4">Our ecosystem &amp; community</p>
          <h2 className="h2 text-balance">A connected ecosystem for learning and opportunity.</h2>
          <p className="mt-4 text-slate">
            Kaushal Hub brings together structured programs, practical resources and people with
            different kinds of experience. Whether someone is exploring a new subject, developing
            a capability or investigating an opportunity, the aim is to make relevant knowledge and
            connections easier to access.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text, to, cta }) => (
            <li key={title}>
              <Link
                to={to}
                className={cn(interactiveCardSurface, "flex h-full flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 md:p-7")}
              >
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-saffron">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="h4 mt-5 font-serif text-navy">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-6 text-slate">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-small font-semibold text-navy">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Vision & mission */}
      <Section white>
        <p className="eyebrow text-center">OUR VISION &amp; MISSION</p>
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-2">
          <div className="kh-surface-navy relative overflow-hidden rounded-3xl bg-navy p-8 shadow-float md:p-10">
            <Eye aria-hidden="true" className="h-9 w-9 text-saffron" strokeWidth={1.25} />
            <p className="eyebrow mt-6 !text-saffron">VISION</p>
            <h2 className="mt-3 text-balance font-serif text-[28px] leading-9 !text-primary-foreground md:text-[34px] md:leading-[44px]">
              A world where useful knowledge leads to meaningful action.
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-tint p-8 md:p-10">
            <Target aria-hidden="true" className="h-9 w-9 text-navy" strokeWidth={1.25} />
            <p className="eyebrow mt-6 !text-navy">MISSION</p>
            <p className="mt-3 font-serif text-[19px] leading-8 text-navy md:text-[22px] md:leading-9">
              To make practical knowledge accessible, connect learning with real-world application,
              and create pathways for people to develop their capabilities and act on new
              opportunities.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
