import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Award, BookOpen, CalendarClock, Clock, Compass, Hammer, Handshake, Landmark, MessagesSquare, Quote, Target, UsersRound, type LucideIcon } from "lucide-react";
import workshop from "@/assets/workshop.webp";
import discussion from "@/assets/discussion.webp";
import { Accordion, ButtonLink, Card, FittPill, Section, SectionHeader, interactiveCardSurface } from "@/components/site";
import { cn } from "@/lib/utils";
import { canonicalLinks, getPublishedResources } from "@/lib/resources";
import { organisationLogos } from "@/lib/organisation-logos";
import { supportingPrograms } from "@/lib/program-nav";
import { publicAsset } from "@/lib/public-asset";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaushal Hub | Practical Learning, Knowledge & Opportunity" },
      { name: "description", content: "Explore practical learning programs, expert knowledge and opportunities to turn knowledge into action with Kaushal Hub." },
      { property: "og:title", content: "Kaushal Hub | Practical Learning, Knowledge & Opportunity" },
      { property: "og:description", content: "Explore practical learning programs, expert knowledge and opportunities to turn knowledge into action with Kaushal Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks("/"),
  }),
  component: Home,
});

const facts = ["12 weeks", "~10 hours per week", "Online + campus immersion at IIT Delhi", "Co-branded certificate"];
const faqLinkClass = "font-medium text-navy underline decoration-navy/40 underline-offset-4 hover:decoration-navy";

const homepageFaqs = [
  {
    q: "What is Kaushal Hub?",
    a: "Kaushal Hub is a learning and knowledge platform by SNN Eduworld Pvt. Ltd. It brings together structured programs, practical resources and opportunities for people at different stages of learning and professional development.",
  },
  {
    q: "Who can participate in Kaushal Hub programs?",
    a: "Our programs are designed for different audiences, depending on the subject and learning objectives. These may include students, undergraduate learners, working professionals and people interested in emerging technologies. Each program page specifies its intended audience and eligibility.",
  },
  {
    q: "What programs does Kaushal Hub offer?",
    a: (
      <>
        Kaushal Hub features programs across areas such as entrepreneurship, practical learning and
        emerging technologies. Visit the <Link to="/programs" className={faqLinkClass}>Programs page</Link>{" "}
        to explore current offerings.
      </>
    ),
  },
  {
    q: "What is the difference between a program and the Knowledge Library?",
    a: (
      <>
        Programs provide structured learning experiences with defined topics, formats and
        durations. The <Link to="/resources" className={faqLinkClass}>Knowledge Library</Link> offers
        articles and practical resources that people can explore independently to learn about
        problems, opportunities and relevant concepts.
      </>
    ),
  },
  {
    q: "Do I need to register to access the Knowledge Library?",
    a: "The Knowledge Library is intended to provide accessible learning resources. Visitors can explore the available articles and guides through the website without enrolling in a program.",
  },
  {
    q: "How can I join the Kaushal Hub community?",
    a: (
      <>
        Visit the <Link to="/community" className={faqLinkClass}>Community page</Link> and complete
        the joining form. You can indicate your interests and how you would like to participate. Any
        community updates will be subject to the preferences you provide.
      </>
    ),
  },
  {
    q: "Can I collaborate with Kaushal Hub or contribute my expertise?",
    a: (
      <>
        Yes. If you have relevant expertise, knowledge resources, learning opportunities or a
        collaboration idea, use the <Link to="/contact" className={faqLinkClass}>Partner with Us</Link>{" "}
        option or <Link to="/contact" className={faqLinkClass}>contact us</Link> to discuss it.
        Potential collaborations will be considered based on their relevance and feasibility.
      </>
    ),
  },
  {
    q: "How can I find out more about Kaushal Hub programs?",
    a: (
      <>
        Visit the <Link to="/programs" className={faqLinkClass}>Programs page</Link> to explore each
        program’s audience, format and learning journey. For questions about dates or registration,{" "}
        <Link to="/contact" className={faqLinkClass}>contact us</Link>.
      </>
    ),
  },
];

function InstitutionalLogoSequence({ decorative = false }: { decorative?: boolean }) {
  return (
    <ul
      className="institutional-logo-sequence"
      aria-hidden={decorative ? true : undefined}
    >
      {organisationLogos.map(({ name, src, width, height }) => (
        <li key={name} className="flex shrink-0 items-center">
          <img
            src={src}
            alt={decorative ? "" : name}
            width={width}
            height={height}
            className="h-7 w-auto max-w-[96px] object-contain md:h-9 md:max-w-[128px]"
          />
        </li>
      ))}
    </ul>
  );
}

function InstitutionalLogoStrip() {
  return (
    <section
      aria-labelledby="institutional-logo-heading"
      className="border-b bg-background py-2.5"
    >
      <div className="container-site flex items-center gap-3 md:gap-6">
        <h2
          id="institutional-logo-heading"
          className="max-w-[6.75rem] shrink-0 text-[13px] font-semibold leading-tight text-navy sm:max-w-none sm:whitespace-nowrap sm:text-small"
        >
          Our Ecosystem Partners
        </h2>
        <span className="h-8 w-px shrink-0 bg-border" aria-hidden="true" />
        <div className="institutional-logo-marquee min-w-0 flex-1">
          <div className="institutional-logo-track">
            <InstitutionalLogoSequence />
            <InstitutionalLogoSequence decorative />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* About Kaushal Hub: editorial split with an image and the motto    */
/* ---------------------------------------------------------------- */

function AboutKaushalHub() {
  return (
    <Section white>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />
            About Kaushal Hub
          </p>
          <h2 className="h2 mt-5 text-balance">Knowledge is the beginning. Application is the point.</h2>
          <p className="mt-6 font-serif text-[20px] leading-8 text-ink md:text-[24px] md:leading-9">
            Kaushal Hub brings together practical learning, expert knowledge and opportunities to put ideas into action.
          </p>
          <div className="mt-8">
            <ButtonLink to="/about" variant="secondary">Discover Kaushal Hub</ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div aria-hidden="true" className="absolute -right-4 -top-4 hidden h-32 w-32 rounded-full border-2 border-dashed border-saffron/40 sm:block" />
          <figure className="group relative overflow-hidden rounded-3xl shadow-float">
            <img
              src={discussion}
              alt="Two professionals in a focused conversation"
              width={1280}
              height={960}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          </figure>
          {/* Motto card, overlapping the image */}
          <div className="relative -mt-16 ml-4 mr-4 rounded-2xl border border-white/70 bg-card/95 p-6 shadow-lift backdrop-blur-xl sm:ml-10 sm:mr-auto sm:max-w-sm lg:-ml-10">
            <span aria-hidden="true" className="absolute inset-y-5 left-0 w-1 rounded-r bg-saffron" />
            <p lang="hi" className="font-serif text-[30px] leading-10 text-navy md:text-[34px] md:leading-[44px]">कौशल से कुशल भारत</p>
            <p className="mt-2 text-small text-slate">From individual capability to a more capable India.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Knowledge Library: editorial feature + two supporting reads       */
/* ---------------------------------------------------------------- */

const previewSlugs = [
  "is-a-business-idea-worth-pursuing",
  "interview-potential-customers",
  "test-whether-customers-will-pay",
];
const categoryLabels: Record<string, string> = {
  "is-a-business-idea-worth-pursuing": "IDEA VALIDATION",
  "interview-potential-customers": "CUSTOMER RESEARCH",
  "test-whether-customers-will-pay": "DEMAND VALIDATION",
};

function HomeKnowledgeLibrary() {
  const published = getPublishedResources().filter((resource) => previewSlugs.includes(resource.slug));
  const [lead, ...rest] = published;
  return (
    <Section white>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-saffron-ink" aria-hidden="true" />
            THE KAUSHAL HUB KNOWLEDGE LIBRARY
          </p>
          <h2 className="h2">Knowledge You Can Put to Work.</h2>
          <p className="mt-4 text-slate">Explore practical guides to validating ideas, understanding customers and making better business decisions.</p>
        </div>
        <ButtonLink to="/resources" variant="text" className="hidden shrink-0 lg:inline-flex">Explore the Knowledge Library</ButtonLink>
      </div>

      {lead ? (
        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {/* Lead article */}
          <Link
            to="/resources/$slug"
            params={{ slug: lead.slug }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-[radial-gradient(700px_320px_at_100%_0%,oklch(0.72_0.15_62/12%),transparent_60%),linear-gradient(180deg,var(--color-tint),var(--color-card))] p-7 shadow-card outline-none transition-[box-shadow,transform] duration-500 ease-brand hover:-translate-y-1 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 md:p-10 lg:col-span-7"
          >
            <BookOpen aria-hidden="true" className="absolute -bottom-6 -right-6 h-40 w-40 text-navy/[0.05] transition-transform duration-700 ease-brand group-hover:-rotate-6" strokeWidth={1} />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-semibold tracking-[0.1em] text-primary-foreground">{categoryLabels[lead.slug]}</span>
                <span className="text-[11px] font-medium tracking-[0.06em] text-slate">{lead.readingTime.toUpperCase()}</span>
              </div>
              <h3 className="mt-6 max-w-xl font-serif text-[28px] leading-9 text-navy md:text-[34px] md:leading-[42px]">{lead.title}</h3>
              <p className="mt-4 max-w-xl text-slate">{lead.summary}</p>
            </div>
            <span className="relative mt-10 inline-flex items-center gap-2 text-small font-semibold text-navy">
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>

          {/* Supporting articles */}
          <ul className="grid gap-5 lg:col-span-5">
            {rest.map((resource, i) => (
              <li key={resource.slug}>
                <Link
                  to="/resources/$slug"
                  params={{ slug: resource.slug }}
                  className={cn(interactiveCardSurface, "flex h-full gap-5 p-6 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2")}
                >
                  <span aria-hidden="true" className="font-serif text-[34px] leading-none text-saffron/80">0{i + 2}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold tracking-[0.08em] text-slate">
                      {categoryLabels[resource.slug]}
                      <span className="font-medium tracking-[0.06em]">· {resource.readingTime.toUpperCase()}</span>
                    </span>
                    <span className="mt-2 font-serif text-[20px] leading-7 text-navy">{resource.title}</span>
                    <span className="mt-2 text-[15px] leading-6 text-slate">{resource.summary}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-navy">
                      Read Article
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-small text-slate">The first resources are being prepared.</p>
      )}
      <div className="mt-8 lg:hidden"><ButtonLink to="/resources" variant="text">Explore the Knowledge Library</ButtonLink></div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Community: navy panel with a connected-network illustration       */
/* ---------------------------------------------------------------- */

const networkNodes: { x: number; y: number; Icon: LucideIcon; hub?: boolean }[] = [
  { x: 50, y: 50, Icon: UsersRound, hub: true },
  { x: 18, y: 22, Icon: BookOpen },
  { x: 82, y: 20, Icon: Hammer },
  { x: 86, y: 74, Icon: MessagesSquare },
  { x: 20, y: 80, Icon: Compass },
];

function CommunityNetwork() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[13rem] sm:max-w-[15rem]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="34" fill="none" stroke="oklch(1 0 0 / 10%)" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth="0.4" />
        {networkNodes.slice(1).map(({ x, y }, i) => (
          <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="oklch(0.72 0.15 62 / 45%)" strokeWidth="0.5" />
        ))}
        <path d="M18 22 Q50 6 82 20 M86 74 Q52 94 20 80" fill="none" stroke="oklch(1 0 0 / 14%)" strokeWidth="0.4" />
      </svg>
      {networkNodes.map(({ x, y, Icon, hub }, i) => (
        <span
          key={i}
          style={{ left: `${x}%`, top: `${y}%` }}
          className={cn(
            "absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
            hub ? "h-16 w-16 bg-saffron text-navy shadow-[0_0_0_7px_oklch(0.72_0.15_62/15%)]" : "h-10 w-10 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur",
          )}
        >
          {hub && <span className="absolute inset-0 rounded-full bg-saffron/40 motion-safe:animate-ping [animation-duration:2.8s]" />}
          <Icon className={cn("relative", hub ? "h-7 w-7" : "h-[18px] w-[18px]")} strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

function HomeCommunity() {
  return (
    <section id="community" className="scroll-mt-20 bg-background py-10 md:py-12">
      <div className="container-site">
        <div className="kh-surface-navy grid items-center gap-6 overflow-hidden rounded-[2rem] bg-navy px-6 py-7 shadow-float sm:px-9 sm:py-8 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:py-8">
          <div className="lg:col-span-7">
            <p className="eyebrow !text-saffron">The Kaushal Hub Community</p>
            <h2 className="h2 mt-4 text-balance !text-primary-foreground">Learning gets stronger when knowledge is shared.</h2>
            <p className="mt-4 max-w-2xl text-primary-foreground/75">Connect with people who are learning, building, sharing expertise and exploring new opportunities. Join the Kaushal Hub community to hear about resources, learning initiatives and ways to participate.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/community">Join the Community</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <CommunityNetwork />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Vision & mission: typographic statement                           */
/* ---------------------------------------------------------------- */

function HomeVisionMission() {
  return (
    <Section white>
      <p className="eyebrow text-center">OUR VISION &amp; MISSION</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-0">
        <div className="relative lg:col-span-7 lg:pr-14">
          <Quote aria-hidden="true" className="h-12 w-12 text-saffron" strokeWidth={1.25} />
          <p className="eyebrow mt-6 !text-navy">VISION</p>
          <h2 className="mt-3 text-balance font-serif text-[30px] leading-10 text-navy md:text-[38px] md:leading-[48px] xl:text-[40px] xl:leading-[50px]">
            A world where useful knowledge leads to meaningful action.
          </h2>
        </div>
        <div className="flex items-center lg:col-span-5 lg:border-l lg:border-border lg:pl-14">
          <div className="relative w-full overflow-hidden rounded-2xl bg-tint p-7 md:p-8">
            <Target aria-hidden="true" className="absolute -right-5 -top-5 h-28 w-28 text-navy/[0.06]" strokeWidth={1} />
            <p className="eyebrow relative !text-navy">MISSION</p>
            <p className="relative mt-3 text-[17px] leading-8 text-ink md:text-[18px]">
              To make practical knowledge accessible, connect learning with real-world application, and create pathways for people to develop their capabilities and act on new opportunities.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* Partner with Kaushal Hub: warm invitation band                    */
/* ---------------------------------------------------------------- */

function PartnerWithUs() {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl border border-saffron/30 bg-[linear-gradient(110deg,oklch(0.72_0.15_62/14%),oklch(0.97_0.007_85)_55%,var(--color-tint))] p-7 shadow-card md:p-10">
          <Handshake aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-48 text-saffron/15" strokeWidth={1} />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-navy text-primary-foreground shadow-lift">
                <Handshake className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <div>
                <p className="eyebrow">PARTNER WITH KAUSHAL HUB</p>
                <h2 className="mt-2 text-balance font-serif text-[24px] leading-8 text-navy md:text-[30px] md:leading-10">Bring your expertise. Create something useful together.</h2>
                <p className="mt-3 max-w-2xl text-slate">Whether you bring industry expertise, learning opportunities, practical insights or an idea for collaboration, let’s explore how we can turn it into something valuable for our community.</p>
              </div>
            </div>
            <ButtonLink to="/contact" className="shrink-0">Partner with Us</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Closing call to action (after the FAQs)                           */
/* ---------------------------------------------------------------- */

function ClosingCta() {
  return (
    <section className="bg-background pb-12 pt-2 md:pb-16">
      <div className="container-site">
        <div className="kh-surface-navy relative overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-center shadow-float sm:px-10 md:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-saffron/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <span aria-hidden="true" className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-saffron text-navy shadow-[var(--kh-shadow-cta)]">
              <ArrowRight className="h-5 w-5 -rotate-45" strokeWidth={2} />
            </span>
            <h2 className="h2 mt-5 text-balance !text-primary-foreground md:!text-[44px] md:!leading-[52px]">Let’s help you take your next step.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/75">Explore practical learning programs, discover useful knowledge or connect with us to discuss an idea, opportunity or collaboration.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink to="/programs">Explore Programs</ButtonLink>
              <ButtonLink to="/contact" variant="inverse">Get in Touch</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Explore our offerings: Experience to Enterprise leads             */
/* ---------------------------------------------------------------- */

const factIcons: LucideIcon[] = [Clock, CalendarClock, Landmark, Award];

function Offerings() {
  return (
    <Section tint>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <p className="eyebrow">Explore our offerings</p>
          <h2 className="h2 mt-4">Find the right program for your next step.</h2>
          <p className="mt-4 max-w-3xl text-slate">From entrepreneurship to applied AI, explore practical programs designed for different stages of learning and building.</p>
        </div>
        <ButtonLink to="/programs" variant="text" className="hidden shrink-0 xl:inline-flex">Explore All Programs</ButtonLink>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Featured program */}
        <article className="kh-surface-navy group relative flex flex-col overflow-hidden rounded-3xl bg-navy text-primary-foreground shadow-float lg:col-span-7">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={workshop}
              alt="Professionals working through a problem together"
              width={1280}
              height={960}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.04] motion-reduce:transition-none"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2 md:left-7 md:top-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy shadow-[var(--kh-shadow-cta)]">
                Featured program
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-small font-medium text-green-700">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-green-600" />
                </span>
                ENROLLING NOW
              </span>
            </div>
          </div>

          <div className="relative -mt-16 flex flex-1 flex-col p-6 md:-mt-20 md:p-9">
            <h3 className="font-serif text-[32px] leading-10 !text-primary-foreground md:text-[42px] md:leading-[50px]">Experience to Enterprise</h3>
            <p className="mt-2 font-serif text-[20px] italic leading-7 text-saffron">Test the leap before you take it.</p>
            <p className="mt-4 max-w-2xl text-primary-foreground/80">
              A 12-week venture-building program for experienced professionals who want to test a business opportunity, engage real customers and build a credible plan before making their next move.
            </p>
            <div className="mt-6 w-fit rounded-2xl bg-card px-3 py-2 sm:rounded-full sm:py-1.5">
              <FittPill />
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {facts.map((fact, i) => {
                const Icon = factIcons[i] ?? Clock;
                return (
                  <li key={fact} className="flex items-start gap-3 rounded-xl border border-primary-foreground/12 bg-primary-foreground/[0.06] p-3.5 text-small font-medium leading-5 text-primary-foreground/90 transition-colors duration-300 hover:border-saffron/40 hover:bg-primary-foreground/10">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
                    {fact}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/experience-to-enterprise" hash="application">Apply Now</ButtonLink>
              <ButtonLink to="/experience-to-enterprise" variant="inverse">View Program</ButtonLink>
            </div>
          </div>
        </article>

        {/* Supporting programs */}
        <div className="flex flex-col lg:col-span-5">
          <h3 className="h4 font-serif text-navy">More Ways to Learn and Build</h3>
          <p className="mt-2 text-[15px] leading-6 text-slate">Explore programs for different stages of learning and professional growth.</p>
          <ul className="mt-5 flex flex-1 flex-col gap-4">
            {supportingPrograms.map(({ to, title, description, metadata, icon: Icon }) => (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className={cn(
                    interactiveCardSurface,
                    "flex h-full gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 md:p-6",
                  )}
                >
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-serif text-[19px] leading-6 text-navy">{title}</span>
                    <span className="mt-1.5 space-y-0.5 text-[13px] leading-5 text-slate">
                      {metadata.map((item) => (
                        <span key={item.label} className="block">
                          <span className="font-semibold text-ink">{item.label}:</span> {item.value}
                        </span>
                      ))}
                    </span>
                    <span className="mt-2 text-[14px] leading-6 text-slate">{description}</span>
                    <span className="mt-3 inline-flex items-center gap-2 text-small font-semibold text-navy">
                      View Program
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 xl:hidden"><ButtonLink to="/programs" variant="text">Explore All Programs</ButtonLink></div>
    </Section>
  );
}

function Home() {
  const [playHeroVideo, setPlayHeroVideo] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The poster photo shows first; the video (about 1 MB) only starts downloading once the
    // page has finished loading, and not at all for data-saver or very slow connections.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    let pageLoaded = false;
    let idleHandle = 0;

    const updatePreference = () => setPlayHeroVideo(pageLoaded && !constrained && !motionPreference.matches);
    const onLoad = () => {
      // Give the browser a moment after load before starting the extra download.
      const start = () => {
        pageLoaded = true;
        updatePreference();
      };
      idleHandle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 300);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    motionPreference.addEventListener("change", updatePreference);
    return () => {
      window.removeEventListener("load", onLoad);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      motionPreference.removeEventListener("change", updatePreference);
    };
  }, []);

  return (
    <>
      <InstitutionalLogoStrip />
      <section data-hero className="section-pad relative isolate overflow-hidden lg:py-28">
        <img
          src={workshop}
          alt=""
          aria-hidden="true"
          width={1280}
          height={960}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {playHeroVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={workshop}
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          >
            <source src={publicAsset("/videos/kaushal-hub-hero.mp4")} type="video/mp4" />
          </video>
        )}
        {/* Layered atmosphere: directional scrim, brand glows, dotted texture, soft hand-off to the next section. */}
        <div aria-hidden="true" className="kh-hero-scrim absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-[-12rem] h-[28rem] w-[28rem] rounded-full bg-saffron/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-navy/15 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-card/70" />
        <div className="container-site relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow kh-rise flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-saffron" />
              Practical learning. Real-world application.
            </p>
            <h1 className="h1 kh-rise mt-5 [--kh-delay:90ms] lg:text-[64px] lg:leading-[72px]">
              Practical learning for people ready to <span className="kh-accent">build what's next.</span>
            </h1>
            <p className="kh-rise mt-6 max-w-xl text-slate [--kh-delay:180ms]">Kaushal Hub brings together practical programs, useful knowledge and opportunities to turn what you know into what you can do.</p>
            <div className="kh-rise mt-10 flex flex-col gap-3 [--kh-delay:270ms] sm:flex-row">
              <ButtonLink to="/programs">Explore Programs</ButtonLink>
              <ButtonLink to="/about" variant="secondary">About Kaushal Hub</ButtonLink>
            </div>
          </div>
          <div className="kh-rise-card relative [--kh-delay:300ms] lg:col-span-5">
            {/* Offset frame behind the card adds depth without new content. */}
            <div aria-hidden="true" className="absolute inset-0 hidden translate-x-3 translate-y-3 rounded-xl border border-navy/15 bg-tint/60 lg:block" />
            <Card className="relative border-white/70 bg-card/90 shadow-float backdrop-blur-xl hover:shadow-float">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Featured program</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-small font-medium text-green-700">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-green-600" />
                  </span>
                  ENROLLING NOW
                </span>
              </div>
              <h2 className="h3 mt-6">Experience to Enterprise</h2>
              <p className="h4 mt-2 font-serif text-navy">Test the leap before you take it.</p>
              <p className="mt-3 text-[16px] leading-6 text-slate">A 12-week venture-building program for experienced professionals exploring entrepreneurship.</p>
              <div className="mt-6 border-t pt-6">
                <FittPill />
              </div>
              <p className="mt-4 text-small font-medium text-navy">12 weeks · Online + campus immersion at IIT Delhi</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/experience-to-enterprise" hash="application">Apply Now</ButtonLink>
                <ButtonLink to="/experience-to-enterprise" variant="secondary">
                  View Program
                </ButtonLink>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <AboutKaushalHub />

      <Offerings />

      <HomeKnowledgeLibrary />

      <HomeCommunity />

      <HomeVisionMission />

      <PartnerWithUs />

      <Section white>
        <SectionHeader
          center
          eyebrow="FREQUENTLY ASKED QUESTIONS"
          title="Questions About Kaushal Hub"
          sub="Learn more about Kaushal Hub, our programs, resources and ways to get involved."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          <Accordion items={homepageFaqs.map(({ q, a }) => ({ q, a, key: q }))} />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
