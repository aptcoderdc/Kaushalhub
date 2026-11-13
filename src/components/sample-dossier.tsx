import { FileText } from "lucide-react";
import { Section, SectionHeader, buttonClass, cardSurface } from "@/components/site";
import { SAMPLE_DISCLOSURE, SAMPLE_DOSSIER_URL } from "@/lib/resources";
import { cn } from "@/lib/utils";

const contents = [
  ["The Problem", "Who experiences the problem, how it is currently addressed and what the evidence suggests."],
  ["Customer Validation", "Interview findings, customer needs, existing alternatives and evidence of willingness to pay."],
  ["The Solution", "A prototype, pilot or minimum viable offer, with the reasoning behind its design."],
  ["The Business Model", "Target customers, pricing assumptions, delivery costs and revenue logic."],
  ["The Go-to-Market Plan", "How the venture could reach its first customers."],
  ["The Financial Model", "Key assumptions, costs, cash requirements and potential risks."],
  ["The Next Decision", "What has been validated, what remains uncertain and whether the venture should proceed, pivot or stop."],
];

export function SampleDossier({ embedded = false, id = "sample-dossier" }: { embedded?: boolean; id?: string }) {
  const content = <>
    <SectionHeader eyebrow="See the expected output" title="What does a finished venture project look like?" sub="Entrepreneurship is easier to evaluate when you can see the work behind the idea." />
    {SAMPLE_DOSSIER_URL && <p className="mt-4 max-w-3xl text-slate">Explore an illustrative Venture Project Dossier to understand how customer evidence, a proposed solution, financial assumptions and a go-to-market plan come together.</p>}
    <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Cover tile: names the document the seven parts add up to. */}
      <li className="kh-surface-navy relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl bg-navy p-6 text-primary-foreground shadow-lift sm:col-span-2 lg:col-span-1">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
          <FileText className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="mt-8">
          <p className="eyebrow !text-saffron">Seven parts</p>
          <h3 className="mt-2 font-serif text-[22px] leading-7 !text-primary-foreground">Sample Venture Project Dossier</h3>
        </div>
        {/* Stacked-sheet edge */}
        <span aria-hidden="true" className="absolute -bottom-2 right-6 h-24 w-20 rotate-6 rounded-md border border-primary-foreground/15 bg-primary-foreground/5" />
      </li>
      {contents.map(([title, description], index) => (
        <li key={title} className={cn(cardSurface, "group flex flex-col p-6 hover:-translate-y-1 motion-reduce:hover:translate-y-0")}>
          <span className="font-serif text-[28px] leading-none text-saffron transition-transform duration-500 ease-brand group-hover:-translate-y-0.5">0{index + 1}</span>
          <h4 className="h4 mt-4">{title}</h4>
          <p className="mt-2 text-[15px] leading-6 text-slate">{description}</p>
        </li>
      ))}
    </ol>
    {SAMPLE_DOSSIER_URL && <div className="mt-8"><a href={SAMPLE_DOSSIER_URL} target="_blank" rel="noopener noreferrer" className={buttonClass()}>View Sample Venture Project Dossier</a><p className="mt-4 text-small text-slate">{SAMPLE_DISCLOSURE}</p></div>}
  </>;

  return embedded ? <section id={id} className="border-t pt-6">{content}</section> : <Section tint id={id}>{content}</Section>;
}
