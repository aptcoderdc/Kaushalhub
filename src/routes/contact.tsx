import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Field, Section, buttonClass, cardSurface } from "@/components/site";
import { cn } from "@/lib/utils";
import { canonicalLinks } from "@/lib/resources";

const directionsUrl = "https://maps.app.goo.gl/PKSL1UK9TJZ1oJ5V9";

const socialProfiles = [
  { name: "Facebook", Icon: Facebook },
  { name: "LinkedIn", Icon: Linkedin },
  { name: "Instagram", Icon: Instagram },
];

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { interest?: string } => {
    const interest = search["interest"];
    return typeof interest === "string" ? { interest } : {};
  },
  head: () => ({
    meta: [
      { title: "Contact Kaushal Hub" },
      {
        name: "description",
        content: "Contact Kaushal Hub with a question, partnership idea or general enquiry.",
      },
      { property: "og:title", content: "Contact Kaushal Hub" },
      {
        property: "og:description",
        content: "Have a question or idea to discuss? Get in touch with Kaushal Hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks("/contact"),
  }),
  component: Contact,
});

const contactLink =
  "group/link inline-flex min-h-11 items-center gap-1.5 rounded-sm font-semibold text-navy underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2";

function ContactCard({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section className={cn(cardSurface, "group flex gap-4 p-5 md:p-6")}>
      <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-tint text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Contact() {
  const [notSent, setNotSent] = useState(false);

  return (
    <>
      <section data-hero className="relative isolate overflow-hidden pb-10 pt-12 md:pb-14 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-navy/10 blur-3xl" />
        <div aria-hidden="true" className="kh-hero-dots pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <p className="eyebrow kh-rise flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />
            Get in touch
          </p>
          <h1 className="h1 kh-rise mt-5 [--kh-delay:80ms]">Contact Us</h1>
          <p className="kh-rise mt-5 max-w-2xl text-[17px] leading-8 text-slate [--kh-delay:160ms] md:text-[19px]">
            Have a question, a partnership idea or something you’d like to discuss with our team? Get
            in touch.
          </p>
        </div>
      </section>

      <Section tint className="!pt-10 md:!pt-14">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Contact details */}
          <div className="grid gap-4 lg:col-span-5">
            <ContactCard icon={MapPin}>
              <h2 id="visit-us-heading" className="h4 font-serif text-navy">Visit Us</h2>
              <address className="mt-2 not-italic leading-7 text-slate">
                <span className="block font-medium text-ink">Kaushal Hub</span>
                <span className="block">C-26, C Block, Sector 59</span>
                <span className="block">Noida, Uttar Pradesh 201309</span>
              </address>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={cn(contactLink, "mt-1 text-small")}>
                Get Directions <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
              </a>
            </ContactCard>

            <ContactCard icon={Phone}>
              <h2 id="call-us-heading" className="h4 font-serif text-navy">Call Us</h2>
              <a href="tel:+919318497057" className={cn(contactLink, "mt-1")}>
                +91-9318497057
              </a>
            </ContactCard>

            <ContactCard icon={Mail}>
              <h2 id="email-us-heading" className="h4 font-serif text-navy">Email Us</h2>
              <a href="mailto:hello@kaushalhub.in" className={cn(contactLink, "mt-1 break-all")}>
                hello@kaushalhub.in
              </a>
            </ContactCard>

            <section className="kh-surface-navy relative overflow-hidden rounded-2xl bg-navy p-6 text-primary-foreground shadow-lift">
              <h2 className="font-serif text-[22px] leading-8 !text-primary-foreground">Connect with Kaushal Hub</h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {socialProfiles.map(({ name, Icon }) => (
                  <li key={name}>
                    <span
                      role="img"
                      aria-label={`${name} profile link not available`}
                      className="inline-flex items-center gap-2 text-small text-primary-foreground/80"
                    >
                      <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/15">
                        <Icon className="h-4 w-4 text-saffron" />
                      </span>
                      <span>{name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-7">
            <div className={cn(cardSurface, "p-6 hover:shadow-card md:p-9")}>
              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-primary-foreground shadow-card">
                  <MessageSquareText className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="h3">How can we help?</h2>
                  <p className="mt-2 text-slate">Tell us a little about your enquiry, and our team will have the context needed to respond.</p>
                </div>
              </div>
              <form
                className="mt-8 grid gap-5 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!event.currentTarget.reportValidity()) return;
                  setNotSent(true);
                }}
              >
                <Field label="Full name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Organisation" name="organisation" />
                <Field
                  label="Enquiry type"
                  name="enquiryType"
                  as="select"
                  required
                  options={[
                    "General enquiry",
                    "Partnership or collaboration",
                    "Institutional or corporate enquiry",
                    "Media or other enquiry",
                  ]}
                />
                <div className="md:col-span-2">
                  <Field label="Message" name="message" as="textarea" required />
                </div>
                <div className="flex flex-col gap-4 border-t border-border/70 pt-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-small text-slate">Fields marked * are required.</p>
                  <button type="submit" className={buttonClass("primary", "w-full md:w-auto")}>
                    Send Enquiry
                  </button>
                </div>
                {notSent && (
                  <p className="kh-panel rounded-lg border border-saffron/40 bg-saffron/10 p-4 text-small leading-6 text-navy md:col-span-2" role="alert">
                    Your enquiry has not been sent because this form is not connected to a submission
                    service yet. Please call +91-9318497057 to reach us.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
