import { useEffect, useState, type ReactNode } from "react";
import { CalendarClock, IndianRupee } from "lucide-react";
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

/** Counselling call time windows; the team confirms the exact appointment. */
const callTimeSlots = ["Morning", "Afternoon", "Evening", "Any time"];

/** Tomorrow as YYYY-MM-DD in the visitor's local time, the earliest date the call can be requested for. */
function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatCallDate(iso: string) {
  const [year = 0, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function ExperienceApplicationForm() {
  const [attempted, setAttempted] = useState<{ callDate: string; callTime: string } | null>(null);
  // Set after hydration so the prerendered HTML and the first client render match.
  const [minCallDate, setMinCallDate] = useState("");
  useEffect(() => setMinCallDate(tomorrowIso()), []);

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) return;
        // The preferred call date and time are part of the form data, alongside every other answer.
        const data = new FormData(event.currentTarget);
        setAttempted({ callDate: String(data.get("preferredCallDate") ?? ""), callTime: String(data.get("preferredCallTime") ?? "") });
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

      <FormGroup
        n={3}
        title="1-to-1 Counselling & Assessment Call"
        intro="After your initial registration, you will have a one-to-one call with our team about your background, interests and expectations. Choose when you would prefer to speak."
      >
        <Field label="Preferred call date" name="preferredCallDate" type="date" min={minCallDate} required />
        <Field label="Preferred time of day (Optional)" name="preferredCallTime" as="select" options={callTimeSlots} />
        <p className="flex gap-3 rounded-xl border border-navy/15 bg-tint p-4 text-small leading-6 text-navy md:col-span-2">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          This is your preferred date. Our team will contact you to confirm the final appointment.
        </p>
      </FormGroup>

      <div className="rounded-2xl border border-saffron/40 bg-card p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 text-small font-medium text-navy">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-navy shadow-card">
              <IndianRupee className="h-4 w-4" />
            </span>
            An initial interest registration fee of ₹29 is payable to submit your application.
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
            Your application, including your preferred call date of {formatCallDate(attempted.callDate)}
            {attempted.callTime && ` (${attempted.callTime.toLowerCase()})`}, has not been submitted. Online
            application processing and the payment flow are not connected, so no details were sent or
            saved and no payment was taken.
          </p>
        )}
      </div>
    </form>
  );
}
