import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  ChevronRight,
  Clock,
  Hammer,
  Lightbulb,
  Megaphone,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink, Section, SectionHeader, interactiveCardSurface } from "@/components/site";
import { cn } from "@/lib/utils";
import { getPublishedResources, resourceCategories, type Resource, type ResourceCategory } from "@/lib/resources";

/** Icon for each library topic. */
export const categoryIcons: Record<ResourceCategory, LucideIcon> = {
  ideas: Lightbulb,
  customers: Users,
  building: Hammer,
  sales: Megaphone,
  finance: Calculator,
  legal: Scale,
};

export function ResourceCard({ resource, presentation = "default", categoryLabel }: { resource: Resource; presentation?: "default" | "library"; categoryLabel?: string | undefined }) {
  const category = resourceCategories.find(item => item.id === resource.category);
  const Icon = categoryIcons[resource.category] ?? BookOpen;
  // Both presentations share one card; the whole card is clickable through the title link.
  return <article className={cn(interactiveCardSurface, "flex h-full min-w-0 flex-col p-6 md:p-7", presentation === "default" && "bg-background")}>
    <div className="flex items-start justify-between gap-3">
      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="mt-1 shrink-0 whitespace-nowrap rounded-full bg-saffron/10 px-2.5 py-1 text-[11px] font-semibold leading-4 tracking-[0.06em] text-saffron-ink">{resource.readingTime.toUpperCase()}</span>
    </div>
    <p className="mt-5 min-w-0 text-[11px] font-semibold leading-4 tracking-[0.08em] text-slate">{(categoryLabel ?? category?.title ?? "").toUpperCase()}</p>
    <h3 className="h4 mt-2 font-serif text-navy">
      <Link
        to="/resources/$slug"
        params={{ slug: resource.slug }}
        className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
      >
        {resource.title}
      </Link>
    </h3>
    <p className="mt-3 flex-1 text-[15px] leading-6 text-slate">{resource.summary}</p>
    <span aria-hidden="true" className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-navy">
      Read Article <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transition-none" />
    </span>
  </article>;
}

export function KnowledgePreview() {
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
  const published = getPublishedResources().filter(resource => previewSlugs.includes(resource.slug));
  return <Section white>
    <div className="max-w-none">
      <p className="eyebrow mb-4">THE KAUSHAL HUB KNOWLEDGE LIBRARY</p>
      <h2 className="h2">Knowledge You Can Put to Work.</h2>
      <p className="mt-4 max-w-none text-slate">Explore practical guides to validating ideas, understanding customers and making better business decisions.</p>
    </div>
    {published.length > 0 ? <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">{published.map(resource => <ResourceCard key={resource.slug} resource={resource} presentation="library" categoryLabel={categoryLabels[resource.slug]} />)}</div> : <p className="mt-8 text-small text-slate">The first resources are being prepared.</p>}
    <div className="mt-8"><ButtonLink to="/resources" variant="text">Explore the Knowledge Library</ButtonLink></div>
  </Section>;
}

const headingId = (heading: string) =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function ResourceArticle({ resource }: { resource: Resource }) {
  const related = getPublishedResources().filter(item => resource.relatedSlugs.includes(item.slug));
  const category = resourceCategories.find(item => item.id === resource.category);
  const CategoryIcon = categoryIcons[resource.category] ?? BookOpen;

  return <>
    {/* Article header */}
    <section data-hero className="relative isolate overflow-hidden pb-12 pt-10 md:pb-16 md:pt-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-navy/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-24 h-[24rem] w-[24rem] rounded-full bg-saffron/12 blur-3xl" />
      <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="kh-rise">
            <ol className="flex flex-wrap items-center gap-1.5 text-small text-slate">
              <li>
                <Link to="/resources" className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm font-semibold text-navy outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-navy">
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:-translate-x-1" aria-hidden="true" />
                  Knowledge Library
                </Link>
              </li>
              {category && <><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li><li>{category.title}</li></>}
            </ol>
          </nav>
          <div className="kh-rise mt-6 flex flex-wrap items-center gap-2 [--kh-delay:60ms]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-[12px] font-semibold text-primary-foreground">
              <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {resource.type}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-[12px] font-medium text-slate">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {resource.readingTime}
            </span>
          </div>
          <h1 className="h1 kh-rise mt-5 text-balance [--kh-delay:120ms]">{resource.title}</h1>
          <p className="kh-rise mt-6 text-[18px] leading-8 text-slate [--kh-delay:180ms] md:text-[20px] md:leading-9">{resource.introduction}</p>
          {(resource.author || resource.publishedAt) && <p className="mt-5 text-small text-slate">{resource.author}{resource.publishedAt && <> · Published <time dateTime={resource.publishedAt}>{resource.publishedAt}</time></>}{resource.updatedAt && <> · Updated <time dateTime={resource.updatedAt}>{resource.updatedAt}</time></>}</p>}
        </div>
      </div>
    </section>

    {/* Body with an in-page contents list on wide screens */}
    <Section white>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-14">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="eyebrow">On this page</p>
            <ol className="mt-4 space-y-1 border-l border-border">
              {resource.sections.map(section => (
                <li key={section.heading}>
                  <a href={`#${headingId(section.heading)}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-small leading-5 text-slate outline-none transition-colors hover:border-saffron hover:text-navy focus-visible:border-saffron focus-visible:text-navy">
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#next-steps" className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-small leading-5 text-slate outline-none transition-colors hover:border-saffron hover:text-navy focus-visible:border-saffron focus-visible:text-navy">Next steps</a>
              </li>
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 space-y-12 lg:col-span-9 lg:max-w-3xl">
          {resource.sections.map((section, index) => (
            <section key={section.heading} id={headingId(section.heading)} className="scroll-mt-28">
              <h2 className="h3 flex items-baseline gap-4">
                <span aria-hidden="true" className="font-serif text-[18px] text-saffron-ink">{String(index + 1).padStart(2, "0")}</span>
                <span>{section.heading}</span>
              </h2>
              <div className="mt-5 space-y-5 text-[17px] leading-8 text-slate">
                {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                {section.example && (
                  <aside className="flex gap-4 rounded-2xl border border-navy/10 bg-tint/70 p-5 text-[16px] leading-7 text-ink">
                    <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-saffron-ink" aria-hidden="true" />
                    <span>{section.example}</span>
                  </aside>
                )}
              </div>
            </section>
          ))}

          <section id="next-steps" className="scroll-mt-28">
            <div className="kh-surface-navy relative overflow-hidden rounded-3xl bg-navy p-7 text-primary-foreground shadow-float md:p-9">
              <h2 className="h3 !text-primary-foreground">Next steps</h2>
              <ul className="mt-5 space-y-3">
                {resource.nextSteps.map(step => (
                  <li key={step} className="flex gap-3 text-primary-foreground/85">
                    <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-saffron text-navy">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {(resource.assetUrl || resource.programLink) && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {resource.assetUrl && <a href={resource.assetUrl} className="inline-flex items-center gap-2 font-semibold text-navy" target="_blank" rel="noopener noreferrer">Open {resource.type.toLowerCase()} <ArrowRight className="h-4 w-4" /></a>}
              {resource.programLink && <ButtonLink to="/experience-to-enterprise" variant="text">Explore Experience to Enterprise</ButtonLink>}
            </div>
          )}
        </article>
      </div>
    </Section>

    {related.length > 0 && (
      <Section tint>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader title="Related resources" />
          <ButtonLink to="/resources" variant="text" className="shrink-0">Knowledge Library</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{related.map(item => <ResourceCard key={item.slug} resource={item} />)}</div>
      </Section>
    )}
  </>;
}
