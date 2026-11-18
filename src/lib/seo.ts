import { programs, type Program } from "@/lib/programs";
import {
  PUBLIC_SITE_ORIGIN,
  getPublishedResources,
  publicPageUrl,
  publishedPagePaths,
  resourceCategories,
  type Resource,
} from "@/lib/resources";
import { socialProfileUrls } from "@/lib/social";

/**
 * Search-engine metadata helpers. Everything here is invisible on the page and is built
 * only from information the site already publishes (names, address, contact details,
 * program facts and article data). Nothing is invented.
 */

export const SITE_NAME = "Kaushal Hub";
const ORG_ID = `${PUBLIC_SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${PUBLIC_SITE_ORIGIN}/#website`;
/** Wide brand logo, used for social previews and as the organisation logo. */
export const SOCIAL_IMAGE = `${PUBLIC_SITE_ORIGIN}/images/brand/kaushal-hub-logo.png`;

type JsonLd = Record<string, unknown>;

/** "<page> | Kaushal Hub" when that fits Google's ~60-character title width, else the page name alone. */
export function pageTitle(name: string) {
  const branded = `${name} | ${SITE_NAME}`;
  return branded.length <= 60 ? branded : name;
}

/**
 * Article summaries are sometimes shorter than the 120–160 characters search results show,
 * so a short summary gets a line naming the Knowledge Library, as long as it still fits.
 */
export function resourceMetaDescription(summary: string) {
  if (summary.length >= 120) return summary;
  for (const suffix of ["A practical guide from the Kaushal Hub Knowledge Library.", "From the Kaushal Hub Knowledge Library."]) {
    const text = `${summary} ${suffix}`;
    if (text.length <= 160) return text;
  }
  return summary;
}

/** A `<script type="application/ld+json">` entry for a route's `head().scripts`. */
export function jsonLd(data: JsonLd | JsonLd[]) {
  const graph = Array.isArray(data) ? data : [data];
  return {
    type: "application/ld+json",
    children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
  };
}

const organizationRef = { "@id": ORG_ID };

/** The Noida office is the organisation's published address, so it is also a LocalBusiness. */
export const organizationSchema: JsonLd = {
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "KaushalHub",
  url: publicPageUrl("/"),
  logo: { "@type": "ImageObject", url: SOCIAL_IMAGE, width: 1877, height: 503 },
  email: "hello@kaushalhub.in",
  telephone: "+91-9318497057",
  image: SOCIAL_IMAGE,
  areaServed: { "@type": "Country", name: "India" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "C-26, C Block, Sector 59",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201309",
    addressCountry: "IN",
  },
  parentOrganization: { "@type": "Organization", name: "SNN Eduworld Pvt. Ltd." },
  sameAs: Object.values(socialProfileUrls),
};

export const websiteSchema: JsonLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  alternateName: "KaushalHub",
  url: publicPageUrl("/"),
  inLanguage: "en-IN",
  publisher: organizationRef,
};

/** Breadcrumb trail: Home first, then each `[name, path]` level. */
export function breadcrumbSchema(trail: [string, string][]): JsonLd {
  const items: [string, string][] = [["Home", "/"], ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: publicPageUrl(path),
    })),
  };
}

function rupees(value: string | undefined) {
  const amount = value?.match(/₹\s*([\d,]+)/)?.[1];
  return amount ? Number(amount.replace(/,/g, "")) : undefined;
}

/** Course markup for a program page, using only the facts listed on that page. */
export function programCourseSchema(program: Program): JsonLd {
  const fact = (label: string) => program.details.find((detail) => detail.label === label)?.value;
  const fee = rupees(fact("Program fee"));
  const format = `${fact("Format") ?? ""} ${fact("Campus immersion") ?? ""}`.toLowerCase();
  const location = fact("Location") ?? fact("Campus immersion");
  const modes = [
    ...(format.includes("online") ? ["Online"] : []),
    ...(format.includes("campus") || format.includes("in-person") || location ? ["Onsite"] : []),
  ];
  return {
    "@type": "Course",
    name: program.title,
    description: program.seoDescription,
    url: publicPageUrl(program.path),
    provider: organizationRef,
    inLanguage: "en",
    ...(fee !== undefined && {
      offers: { "@type": "Offer", category: "Paid", price: fee, priceCurrency: "INR", url: publicPageUrl(program.path) },
    }),
    ...(modes.length > 0 && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: modes,
        ...(location && { location: { "@type": "Place", name: location } }),
      },
    }),
  };
}

/** Course markup for Experience to Enterprise, from the facts published on its page. */
export const experienceToEnterpriseCourseSchema: JsonLd = {
  "@type": "Course",
  name: "Experience to Enterprise",
  description:
    "A 12-week venture-building certificate program for experienced professionals, focused on customer validation, practical experimentation and business viability.",
  url: publicPageUrl("/experience-to-enterprise"),
  provider: organizationRef,
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    name: "Program fee",
    category: "Paid",
    price: 80000,
    priceCurrency: "INR",
    url: publicPageUrl("/experience-to-enterprise"),
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: ["Online", "Onsite"],
    location: { "@type": "Place", name: "FITT, IIT Delhi" },
    courseSchedule: { "@type": "Schedule", duration: "PT10H", repeatFrequency: "Weekly", repeatCount: 12 },
  },
};

/** Article markup for a Knowledge Library resource. */
export function articleSchema(resource: Resource): JsonLd {
  const url = publicPageUrl(`/resources/${resource.slug}`);
  const category = resourceCategories.find((item) => item.id === resource.category)?.title;
  return {
    "@type": "Article",
    headline: resource.title,
    description: resource.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    ...(category && { articleSection: category }),
    author: resource.author ? { "@type": "Person", name: resource.author } : organizationRef,
    publisher: organizationRef,
    image: SOCIAL_IMAGE,
    ...(resource.publishedAt && { datePublished: resource.publishedAt }),
    ...(resource.updatedAt && { dateModified: resource.updatedAt }),
  };
}

/** Every public, indexable URL: static pages, program pages and published articles. */
export function sitemapUrls() {
  const paths = [...publishedPagePaths(), ...programs.map((program) => program.path)];
  return [...new Set(paths)].map((path) => publicPageUrl(path));
}

export function sitemapXml() {
  const articleDates = new Map(
    getPublishedResources().map((resource) => [publicPageUrl(`/resources/${resource.slug}`), resource.updatedAt ?? resource.publishedAt]),
  );
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const entries = sitemapUrls().map((loc) => {
    const lastmod = articleDates.get(loc);
    return `  <url>\n    <loc>${escape(loc)}</loc>${lastmod ? `\n    <lastmod>${escape(lastmod)}</lastmod>` : ""}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

/**
 * /llms.txt (llmstxt.org): a plain Markdown map of the site for AI assistants and AI search,
 * built from the same published pages, programs and articles as the sitemap.
 */
export function llmsTxt() {
  const link = (name: string, path: string, note?: string) =>
    `- [${name}](${publicPageUrl(path)})${note ? `: ${note}` : ""}`;
  const resources = getPublishedResources();
  const sections = [
    `# ${SITE_NAME}`,
    "> Kaushal Hub, an initiative of SNN Eduworld Pvt. Ltd., brings together practical learning programs, a Knowledge Library of business guides and a community built around knowledge and opportunity.",
    "Based in Noida, Uttar Pradesh, India. Contact: hello@kaushalhub.in, +91-9318497057.",
    [
      "## Main pages",
      link("Home", "/", "Overview of programs, the Knowledge Library and community"),
      link("About", "/about", "Who we are and what we work on"),
      link("Programs", "/programs", "All practical learning programs"),
      link("Community", "/community", "Ways to learn, share expertise and connect"),
      link("Contact", "/contact", "Questions, partnerships and enquiries"),
    ].join("\n"),
    [
      "## Programs",
      link(
        "Experience to Enterprise",
        "/experience-to-enterprise",
        "A 12-week venture-building certificate program for experienced professionals, with campus immersion at FITT, IIT Delhi",
      ),
      ...programs.map((program) => link(program.title, program.path, program.seoDescription)),
    ].join("\n"),
    [
      "## Knowledge Library",
      link("Knowledge Library", "/resources", "Practical guides to validating ideas, customers, pricing, pilots and business decisions"),
      ...resources.map((resource) => link(resource.title, `/resources/${resource.slug}`, resource.summary)),
    ].join("\n"),
  ];
  return `${sections.join("\n\n")}\n`;
}
