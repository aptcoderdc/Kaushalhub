import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, LayoutGrid } from "lucide-react";
import { Section, buttonClass } from "@/components/site";
import { ResourceCard, categoryIcons } from "@/components/knowledge";
import {
  canonicalLinks,
  getPublishedResources,
  resourceCategories,
  type ResourceCategory,
} from "@/lib/resources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Knowledge Library | Practical Business Resources — Kaushal Hub" },
      {
        name: "description",
        content:
          "Explore practical guides to validating ideas, understanding customers and making better business decisions.",
      },
      { property: "og:title", content: "The Kaushal Hub Knowledge Library" },
      {
        property: "og:description",
        content:
          "Explore practical guides to validating ideas, understanding customers and making better business decisions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks("/resources"),
  }),
  component: KnowledgeLibrary,
});

function KnowledgeLibrary() {
  const published = getPublishedResources();
  const [filter, setFilter] = useState<ResourceCategory | "all">("all");
  const [displayLimit, setDisplayLimit] = useState(9);
  const filtered =
    filter === "all" ? published : published.filter((resource) => resource.category === filter);
  const visible = filtered.slice(0, displayLimit);
  const categoryLabels: Record<string, string> = {
    "is-a-business-idea-worth-pursuing": "IDEA VALIDATION",
    "interview-potential-customers": "CUSTOMER RESEARCH",
    "test-whether-customers-will-pay": "DEMAND VALIDATION",
    "mvp-prototype-or-pilot": "MVP & PROTOTYPING",
    "calculate-business-break-even": "BUSINESS FINANCE",
    "build-a-business-alongside-employment": "BUILDING ALONGSIDE EMPLOYMENT",
  };
  const select = (id: ResourceCategory | "all") => {
    setFilter(id);
    setDisplayLimit(9);
  };
  const pill = (active: boolean) =>
    cn(
      "group inline-flex min-h-11 items-center gap-2 rounded-full border py-2 pl-2 pr-4 text-small font-medium outline-none transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
      active
        ? "border-navy bg-navy text-primary-foreground shadow-card"
        : "border-border/80 bg-card text-navy hover:border-navy/30 hover:shadow-card",
    );
  const iconWrap = (active: boolean) =>
    cn("grid h-7 w-7 place-items-center rounded-full transition-colors", active ? "bg-saffron text-navy" : "bg-tint text-navy group-hover:bg-saffron/20");

  return (
    <>
      <section data-hero className="relative isolate overflow-hidden pb-10 pt-12 md:pb-14 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-navy/10 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <div className="max-w-4xl">
            <p className="eyebrow kh-rise flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-saffron-ink" aria-hidden="true" />
              The Kaushal Hub Knowledge Library
            </p>
            <h1 className="h1 kh-rise mt-5 text-balance [--kh-delay:80ms]">Knowledge You Can Put to Work.</h1>
            <p className="kh-rise mt-5 max-w-2xl text-[17px] leading-8 text-slate [--kh-delay:160ms] md:text-[19px]">
              Explore practical guides to validating ideas, understanding customers and making better
              business decisions.
            </p>
          </div>
        </div>
      </section>

      <Section tint className="!pt-8 md:!pt-10">
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-card backdrop-blur md:p-5">
          <p className="eyebrow mb-3 px-1">Browse by topic</p>
          <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
            <button onClick={() => select("all")} aria-pressed={filter === "all"} className={pill(filter === "all")}>
              <span aria-hidden="true" className={iconWrap(filter === "all")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </span>
              All topics
            </button>
            {resourceCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              const active = filter === category.id;
              return (
                <button key={category.id} onClick={() => select(category.id)} aria-pressed={active} className={pill(active)}>
                  <span aria-hidden="true" className={iconWrap(active)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-6 text-small text-slate" aria-live="polite">
          Showing {visible.length} of {filtered.length} articles
        </p>
        {visible.length > 0 ? (
          <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                presentation="library"
                categoryLabel={categoryLabels[resource.slug]}
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 border-t pt-8 text-slate">
            No resources in this topic yet. New articles and guides are added as they are ready.
          </p>
        )}
        {visible.length < filtered.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setDisplayLimit((limit) => limit + 9)}
              className={buttonClass("secondary")}
            >
              Load More Articles
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
