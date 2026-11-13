import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Award,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  Compass,
  HandCoins,
  Info,
  Landmark,
  FlaskConical,
  Lightbulb,
  Network,
  Presentation,
  Rocket,
  Search,
  ShieldCheck,
  Target,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import workshop from "@/assets/workshop.webp";
import discussion from "@/assets/discussion.webp";
import {
  Accordion,
  ButtonLink,
  Collapse,
  FittPill,
  Section,
  SectionHeader,
  cardSurface,
} from "@/components/site";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";
import { ExperienceApplicationForm } from "@/components/experience-application-form";
import { FacultySection } from "@/components/faculty-section";
import { facultyMembers } from "@/lib/faculty";
import { canonicalLinks } from "@/lib/resources";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/experience-to-enterprise")({
  head: () => ({
    meta: [
      { title: "Experience to Enterprise | Kaushal Hub" },
      {
        name: "description",
        content:
          "Explore a 12-week venture-building certificate program for experienced professionals, focused on customer validation, practical experimentation and business viability.",
      },
      { property: "og:title", content: "Experience to Enterprise | Kaushal Hub" },
      {
        property: "og:description",
        content:
          "Test the leap before you take it. A 12-week venture-building program for experienced professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks("/experience-to-enterprise"),
  }),
  component: Program,
});

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FITT_CAMPUS_IMAGE = publicAsset("/images/fitt-iit-delhi-campus.webp");
const FITT_LOGO = publicAsset("/images/organisations/fitt-iit-delhi.webp");

/** Sticky section navigation. Ids match the sections below; existing #curriculum and #application anchors are kept. */
const sections: SectionNavItem[] = [
  { id: "overview", label: "Program Overview" },
  { id: "why", label: "Why This Program" },
  { id: "work-on", label: "What You’ll Work On" },
  { id: "curriculum", label: "Curriculum" },
  { id: "faculty", label: "Faculty" },
  { id: "who", label: "Who It’s For" },
  { id: "registration-process", label: "Fees & Registration" },
  { id: "different", label: "How It’s Different" },
  { id: "about-fitt", label: "About FITT" },
  { id: "faq", label: "FAQs" },
];

/** Sections sit under the sticky header and section bar; this keeps their headings clear of both. */
const anchorOffset = "scroll-mt-8 md:scroll-mt-12";

const heroPoints: [LucideIcon, string][] = [
  [Search, "Discover and validate a business opportunity through real customer conversations."],
  [Rocket, "Build a prototype, test your offering and develop a practical go-to-market approach."],
  [Presentation, "Create a venture plan, understand the financial and legal foundations, and present your work at Demo Day."],
];

const snapshot: { icon: LucideIcon; label: string; value: string; note?: string }[] = [
  { icon: Clock, label: "Duration", value: "12 weeks" },
  { icon: CalendarClock, label: "Weekly commitment", value: "Approximately 10 hours", note: "6 live + 4 self-paced and venture work" },
  { icon: Landmark, label: "Format", value: "Online + campus immersion at IIT Delhi" },
  { icon: Users, label: "Participants", value: "Experienced professionals" },
  { icon: Award, label: "Certificate", value: "Co-branded certificate" },
];

const workOn = [
  "Identify meaningful problems within your industry.",
  "Conduct customer discovery and test willingness to pay.",
  "Develop an MVP or pilot-first solution.",
  "Use AI, no-code tools and workflow automation.",
  "Explore go-to-market planning and business development.",
  "Understand finance, funding, legal considerations and business metrics.",
  "Develop a venture presentation and prepare for Demo Day.",
];

const modules: [string, string, string, string][] = [
  [
    "Founder Foundations and Validation",
    "Weeks 1–3",
    "Choosing an entrepreneurial pathway, personal runway and family-finance planning, employment-contract checkpoints including IP and moonlighting, finding problems in your industry, customer discovery with 15+ interviews, buyer mapping, willingness-to-pay tests, and a pilot-first MVP.",
    "Opportunity brief, validated problem statement, pilot scope.",
  ],
  [
    "Build and Operate",
    "Weeks 4–5",
    "AI for non-coders, prompt engineering, no-code prototypes and workflow automation, data-privacy basics including the DPDP Act, briefing developers and vendors, and running a venture alongside a job.",
    "Working prototype or automated workflow, core SOP.",
  ],
  [
    "Go-to-Market",
    "Weeks 6–7",
    "Ideal customer profile, positioning, founder-led content with AI, network-led B2B selling, referrals, outbound, pilot-to-contract conversion, and channel partnerships.",
    "90-day go-to-market plan.",
  ],
  [
    "Finance, Funding and Pitching",
    "Weeks 8–9",
    "Unit economics and pricing, cash flow and runway, a simple three-statement financial model, GST and tax basics, funding routes including bootstrapping, customer-funded growth, angels, venture capital, debt, government schemes and grants, incubators, cap-table basics, entity choice, and pitch and Q&A practice.",
    "Financial model, funding-path memo, 10-slide pitch deck.",
  ],
  [
    "Legal, Leadership and Metrics",
    "Weeks 10–11",
    "Founders’ agreements, IP and trademarks, customer and vendor contracts, compliance calendar, co-founder selection and equity, first hires and advisors, transition planning from a corporate role, KPIs and dashboards, and pivot/persevere/stop decisions.",
    "Legal checklist, team and transition plan, KPI dashboard.",
  ],
  [
    "Capstone and Demo Day",
    "Week 12",
    "A 10-minute pitch and prototype or pilot demonstration, followed by Q&A before a mock investor and mentor panel.",
    "Final pitch and project submission plan.",
  ],
];

const audience: [LucideIcon, string, string][] = [
  [Briefcase, "Mid-career managers", "Professionals exploring an independent venture or a new business opportunity."],
  [Target, "Domain specialists", "People with deep knowledge of a particular industry, customer problem, or market."],
  [Compass, "Consultants", "Professionals looking to build a scalable business around their expertise."],
  [UserRoundCheck, "Senior individual contributors", "Experienced professionals with specialised knowledge and industry relationships."],
];

const fees = [
  { step: 2, label: "Initial Interest Registration", amount: "₹99" },
  { step: 5, label: "Program Registration", amount: "₹4,000" },
  { step: 6, label: "Program Fee", amount: "₹80,000" },
];

const faqs: [string, string][] = [
  [
    "Who is this program for?",
    "Experience to Enterprise is designed for experienced professionals who want to investigate entrepreneurship and evaluate a business opportunity using their industry experience and networks.",
  ],
  [
    "Do I need a technical or coding background?",
    "No. The program introduces AI-assisted tools, no-code approaches and ways to work with developers or vendors where required.",
  ],
  [
    "Can I participate while continuing to work?",
    "The program is designed for professionals exploring entrepreneurship alongside their current commitments. The indicative weekly commitment is about 10 hours.",
  ],
  [
    "What is the duration and format?",
    "The program runs for 12 weeks, with approximately six hours of live sessions and four hours of self-paced learning and venture work per week. It combines online learning with a 2–3 day campus immersion at IIT Delhi.",
  ],
  [
    "What is the fee structure?",
    "The ₹99 fee is for initial interest registration. The ₹4,000 program-registration fee is separate from the ₹80,000 program fee.",
  ],
  [
    "Does the program guarantee incubation or funding?",
    "No. Selected ventures may be considered for incubation, investor connections or funding and grant support, subject to evaluation, availability and the applicable selection process.",
  ],
  [
    "What is included in the campus immersion at FITT, IIT Delhi?",
    "The campus immersion runs for 2–3 days at FITT, IIT Delhi. Meals are included; travel and accommodation are not included. Participants receive their physical certificate during the immersion.",
  ],
  [
    "What are the eligibility requirements for receiving the program certificate?",
    "The program awards a co-branded certificate. To receive it, participants need a minimum of 70% attendance and a minimum 40% cumulative evaluation score. A physical certificate is provided during the campus immersion, along with an encrypted digital certificate that can be verified online. The certificate confirms program completion against the stated requirements; it does not guarantee the success of a venture.",
  ],
];

/** "How it's different": facts about this program only — no claims about other programs. */
const differences: { icon: LucideIcon; matters: string; approach: string; condition?: string }[] = [
  {
    icon: Briefcase,
    matters: "Experienced-professional focus",
    approach: "Designed for mid-career professionals, typically aged 30–50, who want to explore entrepreneurship while continuing to work.",
  },
  {
    icon: Search,
    matters: "Real customer discovery",
    approach: "Participants investigate industry problems, conduct 15+ customer interviews, map buyers and examine willingness to pay.",
  },
  {
    icon: CalendarClock,
    matters: "Build while you work",
    approach: "Approximately 10 hours per week, with live sessions, self-paced learning and venture work.",
  },
  {
    icon: Rocket,
    matters: "Practical venture development",
    approach: "Work through opportunity validation, prototypes, go-to-market planning, financial foundations and a final venture presentation.",
  },
  {
    icon: ShieldCheck,
    matters: "IP awareness and guidance",
    approach: "Eligible participants may explore IP-related guidance, including invention disclosure and patent-search support through FITT’s relevant processes.",
    condition: "Any IP support is subject to eligibility and applicable processes. Patent filing and grant outcomes are not guaranteed.",
  },
  {
    icon: HandCoins,
    matters: "Cohort participation",
    approach: "Participants contribute to a shared investment pool, with the cohort voting on promising ventures that may receive support under the program’s stated terms.",
    condition: "Eligibility, selection criteria and the final allocation process will be communicated as part of the program terms.",
  },
  {
    icon: Landmark,
    matters: "FITT, IIT Delhi association",
    approach: "A program associated with FITT, IIT Delhi, with a co-branded certificate subject to completion requirements.",
  },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function IconBadge({ icon: Icon, tone = "tint", className }: { icon: LucideIcon; tone?: "tint" | "navy" | "glass"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300",
        tone === "tint" && "bg-tint text-navy",
        tone === "navy" && "bg-navy text-primary-foreground shadow-card",
        tone === "glass" && "bg-primary-foreground/10 text-saffron ring-1 ring-primary-foreground/15",
        className,
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={1.5} />
    </span>
  );
}

/** Small-print conditions, styled so they read as part of the card rather than an afterthought. */
function Condition({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={cn("mt-5 flex gap-2.5 border-t pt-4 text-small leading-6", light ? "border-primary-foreground/15 text-primary-foreground/70" : "border-border/70 text-slate")}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function ImageFrame({ src, alt, className, imgClassName, children }: { src: string; alt: string; className?: string; imgClassName?: string; children?: ReactNode }) {
  return (
    <figure className={cn("group relative", className)}>
      <div aria-hidden="true" className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-3xl border border-saffron/40 bg-saffron/10 sm:block" />
      <div className="relative h-full overflow-hidden rounded-3xl shadow-float">
        <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.03] motion-reduce:transition-none", imgClassName)} />
      </div>
      {children}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Program() {
  return (
    <>
      <Hero />
      <SectionNav items={sections} />
      <WhyChoose />
      <WhatYoullWorkOn />
      <Curriculum />
      <FacultySection faculty={facultyMembers} tint id="faculty" eyebrow="Faculty" className={anchorOffset} />
      <WhoItsFor />
      <FeesAndRegistration />
      <Application />
      <HowItsDifferent />
      <AboutFitt />
      <Faq />
    </>
  );
}

/* ---------- 1. Hero + snapshot ---------- */
function Hero() {
  return (
    <section id="overview" data-hero className={cn("relative isolate overflow-hidden pb-12 pt-10 md:pb-16 md:pt-16", anchorOffset)}>
      {/* Atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-saffron/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-navy/10 blur-3xl" />
      <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6 xl:col-span-7">
          <p className="eyebrow kh-rise flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />A Kaushal Hub + FITT, IIT Delhi program
          </p>
          <h1 className="h1 kh-rise mt-5 [--kh-delay:80ms] lg:text-[60px] lg:leading-[68px]">Experience to Enterprise</h1>
          <p className="h3 kh-rise mt-4 font-serif text-navy [--kh-delay:150ms]">
            <span className="kh-accent">Test the leap before you take it.</span>
          </p>

          <ul className="mt-8 space-y-4">
            {heroPoints.map(([Icon, text], i) => (
              <li
                key={text}
                style={{ "--kh-delay": `${230 + i * 80}ms` } as CSSProperties}
                className="kh-rise flex items-start gap-4"
              >
                <span aria-hidden="true" className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-saffron/30 bg-card text-saffron-ink shadow-card">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-[16px] leading-7 text-ink md:text-[17px]">{text}</span>
              </li>
            ))}
          </ul>

          <div className="kh-rise mt-8 [--kh-delay:480ms]">
            <FittPill />
          </div>
          <div className="kh-rise mt-8 flex flex-col gap-3 [--kh-delay:540ms] sm:flex-row">
            <ButtonLink to="/experience-to-enterprise" hash="application">
              Apply Now
            </ButtonLink>
            <ButtonLink to="/experience-to-enterprise" hash="curriculum" variant="secondary">
              Explore the Program
            </ButtonLink>
          </div>
        </div>

        <div className="kh-rise-card [--kh-delay:250ms] lg:col-span-6 xl:col-span-5">
          <ImageFrame
            src={FITT_CAMPUS_IMAGE}
            alt="The Foundation for Innovation and Technology Transfer building at IIT Delhi"
            className="aspect-[4/3]"
            imgClassName="object-left-bottom"
          />
        </div>
      </div>

      {/* Program snapshot — the single place these facts are listed. */}
      <div className="container-site relative mt-12 md:mt-16">
        <h2 className="sr-only">Program snapshot</h2>
        {/* gap-px over a border-coloured backdrop draws hairline dividers at every breakpoint */}
        <dl className="kh-rise grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/70 shadow-lift [--kh-delay:600ms] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {snapshot.map(({ icon: Icon, label, value, note }, i) => (
            <div
              key={label}
              className={cn(
                "flex gap-3 bg-card p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklch,var(--color-tint)_45%,var(--color-card))] md:p-6",
                i === snapshot.length - 1 && "sm:col-span-2 xl:col-span-1",
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-saffron-ink" strokeWidth={1.75} aria-hidden="true" />
              <div className="min-w-0">
                <dt className="eyebrow !text-[11px]">{label}</dt>
                <dd className="mt-1.5 font-serif text-[18px] leading-6 text-navy">{value}</dd>
                {note && <dd className="mt-1 text-[13px] leading-5 text-slate">{note}</dd>}
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- 2. Why choose ---------- */
function WhyChoose() {
  return (
    <Section white id="why" className={anchorOffset}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-44">
            <ImageFrame src={workshop} alt="Professionals in a working session" className="aspect-[4/3] lg:aspect-[4/5]" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <SectionHeader eyebrow="What makes this program different" title="Why choose Experience to Enterprise?" />
          <div className="mt-8 grid gap-5">
            <FeatureCard icon={ShieldCheck} title="Your Brand, Your Idea, Your IP" condition="Any IP support is subject to eligibility and applicable processes. Patent filing and grant outcomes are not guaranteed.">
              Build with a clearer understanding of how intellectual property can support your venture. Eligible participants may explore IP-related guidance, including invention disclosure and patent-search support through FITT’s relevant processes.
            </FeatureCard>
            <FeatureCard icon={HandCoins} title="The Batch Invests in Itself" condition="Eligibility, selection criteria and the final allocation process will be communicated as part of the program terms.">
              Every participant contributes to a shared investment pool as part of the program fee. At Demo Day, a panel of judges evaluates the ventures, and the cohort votes on which promising venture or ventures should receive the pool’s support. This creates an opportunity for participants to back promising ideas emerging from their own batch.
            </FeatureCard>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className={cn(cardSurface, "p-6 md:p-7")}>
              <IconBadge icon={Briefcase} />
              <p className="eyebrow mt-5">Build while you work</p>
              <h3 className="h4 mt-2">You don’t have to quit your job on day one.</h3>
              <p className="mt-3 text-[15px] leading-6 text-slate">
                About 10 hours a week lets you test an opportunity before making a career transition. The program provides a structured way to investigate assumptions and gather evidence while continuing to work. It does not promise business success.
              </p>
            </div>
            <div className={cn(cardSurface, "p-6 md:p-7")}>
              <IconBadge icon={Lightbulb} />
              <p className="eyebrow mt-5">AI and no-code</p>
              <h3 className="h4 mt-2">Move faster as a non-technical founder.</h3>
              <p className="mt-3 text-[15px] leading-6 text-slate">
                Explore AI-assisted research, prompt engineering, no-code tools, workflow automation and rapid prototyping. Learn how to test ideas and brief developers or vendors when more complex technology is needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FeatureCard({ icon, title, condition, children }: { icon: LucideIcon; title: string; condition: string; children: ReactNode }) {
  return (
    <article className={cn(cardSurface, "group relative overflow-hidden p-6 md:p-8")}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-saffron to-saffron/30" />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <IconBadge icon={icon} tone="navy" className="group-hover:bg-saffron group-hover:text-navy" />
        <div>
          <h3 className="h3 font-serif text-navy">{title}</h3>
          <p className="mt-3 leading-7 text-slate">{children}</p>
          <Condition>{condition}</Condition>
        </div>
      </div>
    </article>
  );
}

/* ---------- 3. What you'll work on ---------- */
function WhatYoullWorkOn() {
  return (
    <Section tint id="work-on" className={anchorOffset}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeader
            eyebrow="What you’ll work on"
            title="A practical journey from problem to pitch."
            sub="You’ll work on your own venture opportunity throughout the program."
          />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {workOn.map((item, i) => (
              <li
                key={item}
                className={cn(
                  "group flex items-start gap-3 rounded-xl border border-white/70 bg-card/80 p-4 shadow-card backdrop-blur transition-[transform,box-shadow] duration-500 ease-brand hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transition-none",
                  i === workOn.length - 1 && "sm:col-span-2",
                )}
              >
                <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron/15 text-saffron-ink transition-colors duration-300 group-hover:bg-saffron group-hover:text-navy">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="text-[15px] leading-6 text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-5">
          <ImageFrame src={discussion} alt="Two professionals in a focused one-to-one conversation" className="aspect-[4/3] lg:aspect-[4/5]">
            <figcaption className="absolute -bottom-6 left-5 right-5 rounded-xl border border-white/60 bg-card/95 p-4 shadow-lift backdrop-blur-xl sm:left-auto sm:right-8 sm:max-w-[16rem]">
              <p className="eyebrow !text-[11px]">Weeks 1–3</p>
              <p className="mt-1 text-small font-medium leading-5 text-navy">Customer discovery with 15+ interviews</p>
            </figcaption>
          </ImageFrame>
        </div>
      </div>
    </Section>
  );
}

/* ---------- 4. Curriculum ---------- */
function Curriculum() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section white id="curriculum" className={anchorOffset}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-44">
            <SectionHeader
              eyebrow="Curriculum"
              title="Six modules, twelve weeks."
              sub="From opportunity discovery to customer validation, building, commercial planning and a final presentation, you’ll work on your own venture opportunity throughout the program."
            />
            {/* Week ruler: a compact visual of how the 12 weeks are split. */}
            <div aria-hidden="true" className="mt-8 hidden lg:block">
              <div className="flex gap-1">
                {modules.map(([title, weeks], i) => {
                  const span = weeks.includes("–") ? Number(weeks.split("–")[1]) - Number(weeks.replace(/\D+(\d+).*/, "$1")) + 1 : 1;
                  return (
                    <button
                      key={title}
                      type="button"
                      tabIndex={-1}
                      onClick={() => setOpen(i)}
                      style={{ flexGrow: span }}
                      className={cn("h-2 basis-0 rounded-full transition-colors duration-300", open === i ? "bg-saffron" : "bg-tint hover:bg-navy/20")}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-[12px] font-medium text-slate">
                <span>Week 1</span>
                <span>Week 12</span>
              </div>
            </div>
          </div>
        </div>
        <ol className="space-y-3 lg:col-span-8">
          {modules.map(([title, weeks, content, output], index) => {
            const isOpen = open === index;
            return (
              <li
                key={title}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card transition-[box-shadow,border-color] duration-500 ease-brand",
                  isOpen ? "border-navy/20 shadow-lift" : "border-border/80 shadow-card hover:border-navy/15",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy md:gap-5 md:p-6"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-xl font-serif text-[18px] transition-colors duration-300 md:h-12 md:w-12",
                      isOpen ? "bg-navy text-primary-foreground" : "bg-tint text-navy group-hover:bg-navy/10",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block !text-[11px] !text-saffron-ink">{weeks}</span>
                    <span className="h4 mt-1 block font-serif text-navy">
                      Module {index + 1} — {title}
                    </span>
                  </span>
                  <span aria-hidden="true" className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] duration-300", isOpen ? "border-navy bg-navy text-primary-foreground" : "border-border text-navy group-hover:border-navy/40")}>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-500 ease-brand", isOpen && "rotate-180")} />
                  </span>
                </button>
                <Collapse open={isOpen}>
                  <div className="space-y-4 px-5 pb-6 text-slate md:pl-[5.75rem] md:pr-8">
                    <p className="leading-7">{content}</p>
                    <p className="flex gap-3 rounded-xl border border-navy/10 bg-tint/70 p-4 text-navy">
                      <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron-ink" aria-hidden="true" />
                      <span>
                        <span className="font-semibold">You produce: </span>
                        {output}
                      </span>
                    </p>
                  </div>
                </Collapse>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/* ---------- 5. Who it's for ---------- */
function WhoItsFor() {
  return (
    <section id="who" className={cn("section-pad bg-background", anchorOffset)}>
      <div className="container-site">
        <div className="kh-surface-navy rounded-3xl bg-navy p-6 shadow-float sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4 !text-saffron">Who it’s for</p>
              <h2 className="font-serif text-[28px] leading-9 !text-primary-foreground md:text-[34px] md:leading-[42px]">
                Experienced professionals exploring entrepreneurship while still working.
              </h2>
              <p className="mt-4 text-primary-foreground/75">Typically aged 30–50, with industry knowledge, networks and credibility.</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-small font-medium text-primary-foreground/90">
                <Check className="h-4 w-4 text-saffron" aria-hidden="true" />
                No technical background required
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {audience.map(([icon, title, text]) => (
                <li
                  key={title}
                  className="group rounded-2xl border border-primary-foreground/12 bg-primary-foreground/[0.06] p-6 backdrop-blur transition-[background-color,border-color,transform] duration-500 ease-brand hover:-translate-y-1 hover:border-saffron/40 hover:bg-primary-foreground/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <IconBadge icon={icon} tone="glass" />
                  <h3 className="mt-5 font-serif text-[21px] leading-7 !text-primary-foreground">{title}</h3>
                  <p className="mt-2 text-small leading-6 text-primary-foreground/75">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. Fees and registration ---------- */
function FeesAndRegistration() {
  return (
    <Section white id="registration-process" className={anchorOffset}>
      <SectionHeader
        eyebrow="Fees & registration"
        title="Program Fee and Registration Process"
        sub="Begin by sharing your motivation and entrepreneurial interests. Learn more about the program through an introductory webinar and counselling before proceeding to program registration."
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Fee summary */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-44">
            <div className={cn(cardSurface, "overflow-hidden hover:shadow-card")}>
              <p className="eyebrow border-b border-border/70 px-6 py-4">Fee structure</p>
              <ul>
                {fees.map(({ step, label, amount }, i) => (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center justify-between gap-4 px-6 py-5",
                      i < fees.length - 1 && "border-b border-border/70",
                      i === fees.length - 1 && "kh-surface-navy bg-navy",
                    )}
                  >
                    <div>
                      <p className={cn("text-[12px] font-semibold uppercase tracking-[0.12em]", i === fees.length - 1 ? "text-saffron" : "text-slate")}>Step {step}</p>
                      <p className={cn("mt-1 font-medium", i === fees.length - 1 ? "text-primary-foreground" : "text-navy")}>{label}</p>
                    </div>
                    <p className={cn("font-serif text-[28px] font-semibold leading-none", i === fees.length - 1 ? "text-primary-foreground" : "text-navy")}>{amount}</p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 flex gap-3 rounded-xl border border-navy/15 bg-tint p-4 text-small font-semibold leading-6 text-navy">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              The ₹4,000 program-registration fee is separate from the ₹80,000 program fee.
            </p>
          </div>
        </aside>

        {/* Onboarding journey */}
        <ol className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-0.5 bg-gradient-to-b from-navy via-navy/30 to-saffron" />
          <Stage n={1} title="Apply Now">
            <p className="mt-2 leading-7 text-slate">
              Share your professional background, motivation for exploring entrepreneurship, and the opportunity or business problem you are interested in investigating.
            </p>
            <ButtonLink to="/experience-to-enterprise" hash="application" variant="text" className="mt-2">
              Go to application form
            </ButtonLink>
          </Stage>
          <Stage n={2} title="Initial Interest Registration" amount="₹99">
            <p className="mt-2 leading-7 text-slate">
              Complete the initial interest-registration step to proceed with the introductory process. This is the initial interest-registration fee.
            </p>
          </Stage>
          <Stage n={3} title="Attend the Introductory Webinar">
            <p className="mt-2 leading-7 text-slate">
              Learn about the program structure, curriculum, expectations, and participation requirements before deciding whether to proceed.
            </p>
            <p className="mt-2 text-small text-slate">The webinar date and joining details will be communicated to applicants.</p>
          </Stage>
          <Stage n={4} title="Program Counselling">
            <p className="mt-2 leading-7 text-slate">
              Discuss your interests, professional background, and expectations to better understand whether the program aligns with your goals.
            </p>
            <p className="mt-2 text-small text-slate">Counselling arrangements are subject to the program’s actual process.</p>
          </Stage>
          <Stage n={5} title="Program Registration" amount="₹4,000">
            <p className="mt-2 leading-7 text-slate">
              If you decide to proceed after the webinar and counselling, complete the separate program-registration step.
            </p>
          </Stage>
          <Stage n={6} title="Program Fee" amount="₹80,000" last>
            <p className="mt-2 leading-7 text-slate">The program fee for the 12-week Experience to Enterprise certificate program.</p>
          </Stage>
        </ol>
      </div>
    </Section>
  );
}

function Stage({ n, title, amount, last, children }: { n: number; title: string; amount?: string; last?: boolean; children: ReactNode }) {
  return (
    <li className={cn("group relative pl-16", !last && "pb-8")}>
      <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border-2 border-navy bg-card font-serif text-[17px] text-navy shadow-card transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
        {n}
      </span>
      <div className={cn(cardSurface, "p-5 md:p-6")}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="h4 font-serif text-navy">{title}</h3>
          {amount && <p className="rounded-full bg-saffron/15 px-3 py-1 font-serif text-[20px] font-semibold leading-7 text-navy">{amount}</p>}
        </div>
        {children}
      </div>
    </li>
  );
}

/* ---------- 10. Application ---------- */
function Application() {
  return (
    <Section tint id="application" className={anchorOffset}>
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Application"
          title="Apply for Experience to Enterprise"
          sub="Tell us about your professional background, your motivation for exploring entrepreneurship, and what you hope to gain from the program."
        />
        <div className="mt-8">
          <ExperienceApplicationForm />
        </div>
      </div>
    </Section>
  );
}

/* ---------- 11. How it's different ---------- */
function HowItsDifferent() {
  return (
    <Section white id="different" className={anchorOffset}>
      <SectionHeader
        center
        eyebrow="How it’s different"
        title="How Is Experience to Enterprise Different?"
        sub="A practical program designed around the realities of exploring entrepreneurship while continuing your professional career."
      />

      <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lift">
        {/* Column headings (tablet and up) */}
        <div className="hidden grid-cols-[minmax(0,15rem)_9.5rem_minmax(0,1fr)] md:grid lg:grid-cols-[minmax(0,17rem)_11rem_minmax(0,1fr)]" aria-hidden="true">
          <p className="eyebrow flex items-end px-6 pb-4 pt-6">What matters</p>
          <p className="kh-surface-navy flex items-end justify-center rounded-t-2xl bg-navy px-3 pb-4 pt-6 text-center font-serif text-[17px] leading-6 text-primary-foreground">
            Experience to Enterprise
          </p>
          <p className="eyebrow flex items-end px-6 pb-4 pt-6">How the program approaches it</p>
        </div>

        <ul role="list">
          {differences.map(({ icon: Icon, matters, approach, condition }, i) => (
            <li
              key={matters}
              className={cn(
                "group grid gap-x-0 border-t border-border/70 transition-colors duration-300 hover:bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-card))] md:grid-cols-[minmax(0,15rem)_9.5rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,17rem)_11rem_minmax(0,1fr)]",
                i === 0 && "md:border-t-0",
              )}
            >
              {/* What matters */}
              <div className="flex items-center gap-4 px-5 pb-2 pt-5 md:px-6 md:py-6">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-serif text-[19px] leading-6 text-navy">{matters}</h3>
              </div>

              {/* Experience to Enterprise column */}
              <div className="hidden items-center justify-center bg-navy/[0.04] md:flex">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron text-navy shadow-[var(--kh-shadow-cta)] transition-transform duration-500 ease-brand group-hover:scale-110 motion-reduce:transition-none">
                  <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  <span className="sr-only">Part of Experience to Enterprise</span>
                </span>
              </div>

              {/* How the program approaches it */}
              <div className="px-5 pb-5 md:px-6 md:py-6">
                <p className="text-[15px] leading-6 text-ink md:text-[16px] md:leading-7">{approach}</p>
                {condition && (
                  <p className="mt-3 flex gap-2 text-small leading-5 text-slate">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{condition}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- 12. About FITT, IIT Delhi ---------- */
function AboutFitt() {
  return (
    <Section tint id="about-fitt" className={anchorOffset}>
      <div className="mx-auto max-w-6xl">
        <figure className="group relative overflow-hidden rounded-3xl shadow-float">
          <img
            src={FITT_CAMPUS_IMAGE}
            alt="The Foundation for Innovation and Technology Transfer building at IIT Delhi"
            width={1474}
            height={1100}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover object-[50%_35%] transition-transform duration-[1400ms] ease-brand group-hover:scale-[1.02] motion-reduce:transition-none md:aspect-[16/8]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/35 to-transparent" />
        </figure>

        {/* Overlapping content panel */}
        <div className="relative z-10 mx-3 -mt-16 rounded-3xl border border-white/70 bg-card p-6 shadow-float sm:mx-6 sm:-mt-24 sm:p-10 lg:mx-12 lg:-mt-36 lg:p-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <span className="grid h-16 w-24 shrink-0 place-items-center rounded-2xl border border-border/80 bg-card px-3 shadow-card">
              <img src={FITT_LOGO} alt="FITT, IIT Delhi" width={80} height={40} loading="lazy" className="h-auto w-full object-contain" />
            </span>
            <div>
              <p className="eyebrow">The institution</p>
              <h2 className="h2 mt-3">About FITT, IIT Delhi</h2>
              <p className="mt-5 max-w-3xl text-[17px] leading-8 text-slate md:text-[18px]">
                The Foundation for Innovation and Technology Transfer (FITT) is the industry interface and technology transfer arm of the Indian Institute of Technology Delhi. Established in 1992, FITT works to translate academic research into real-world impact by enabling collaboration between IIT Delhi and industry, government, investors and entrepreneurs.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {(
              [
                [
                  FlaskConical,
                  "Innovation and Technology Transfer",
                  "FITT supports the innovation lifecycle through intellectual property creation and licensing, research and development partnerships, consulting, skill development, and the incubation and acceleration of technology-driven startups. It also manages the Research and Innovation Park at IIT Delhi.",
                ],
                [
                  Network,
                  "Startups and Innovation Ecosystem",
                  "Through incubation, acceleration and structured innovation programmes, FITT connects innovators with industry, corporates, investors and other ecosystem stakeholders. Its work spans sectors including healthcare, AI, clean energy, mobility, defence, advanced materials and digital technologies.",
                ],
              ] as const
            ).map(([Icon, title, text]) => (
              <article key={title} className={cn(cardSurface, "group relative overflow-hidden bg-background/60 p-6 md:p-8")}>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-saffron to-saffron/20" />
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-primary-foreground shadow-card transition-colors duration-300 group-hover:bg-saffron group-hover:text-navy">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="h4 mt-5">{title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- 13. FAQ ---------- */
function Faq() {
  return (
    <Section white id="faq" className={anchorOffset}>
      <SectionHeader center eyebrow="FAQs" title="Frequently Asked Questions" />
      <div className="mx-auto mt-10 max-w-4xl md:mt-12">
        <Accordion items={faqs.map(([q, a]) => ({ q, a, key: q }))} />
      </div>
    </Section>
  );
}
