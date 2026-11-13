import { useState, type ReactNode } from "react";
import { IndianRupee } from "lucide-react";
import { Field, buttonClass } from "@/components/site";

function FormGroup({ n, title, intro, children }: { n: number; title: string; intro: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-border/80 bg-card p-5 shadow-card md:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy font-serif text-[18px] text-primary-foreground shadow-card">
          {n}
        </span>
        <div>
          <h3 className="h3">{title}</h3>
          <p className="mt-2 text-small text-slate">{intro}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function ExperienceApplicationForm() {
  const [attempted, setAttempted] = useState(false);

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (event.currentTarget.reportValidity()) setAttempted(true);
      }}
    >
      <FormGroup
        n={1}
        title="Contact and Professional Background"
        intro="Share the details needed to understand your professional context."
      >
        <Field label="Full name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
        <Field label="Phone number" name="phone" type="tel" required />
        <Field label="Current role" name="role" required />
        <Field
          label="Years of professional experience"
          name="years"
          as="select"
          options={[
            "Less than 3 years",
            "3–5 years",
            "6–10 years",
            "11–15 years",
            "16–20 years",
            "More than 20 years",
          ]}
          required
        />
        <Field label="Industry or area of expertise" name="industry" required />
      </FormGroup>

      <FormGroup
        n={2}
        title="Motivation and Entrepreneurial Mindset"
        intro="You can apply while you are still exploring and do not need a fully developed business idea."
      >
        <div className="md:col-span-2">
          <Field
            label="What interests you about exploring entrepreneurship?"
            name="motivation"
            as="textarea"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="What business problem, opportunity or idea are you interested in investigating? (Optional)"
            name="opportunity"
            as="textarea"
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="What would you most like to gain from this program?"
            name="goals"
            as="textarea"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="How ready are you to explore a venture alongside your current professional commitments?"
            name="readiness"
            as="textarea"
            required
          />
        </div>
      </FormGroup>

      <div className="rounded-2xl border border-saffron/40 bg-card p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 text-small font-medium text-navy">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-navy shadow-card">
              <IndianRupee className="h-4 w-4" />
            </span>
            An application fee of ₹99 is payable to submit your application.
          </p>
          <button type="submit" className={buttonClass("primary", "w-full shrink-0 md:w-auto")}>
            Submit Application &amp; Pay Fee
          </button>
        </div>
        {attempted && (
          <p
            role="alert"
            className="kh-panel mt-4 rounded-lg border border-saffron/40 bg-card p-4 text-small text-navy"
          >
            Your application has not been submitted. Online application processing and the payment
            flow are not connected, so no details were sent or saved and no payment was taken.
          </p>
        )}
      </div>
    </form>
  );
}
