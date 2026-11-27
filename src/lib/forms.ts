/**
 * Website form submissions (Contact and Join the Community).
 *
 * Every form posts to one Google Apps Script web app, which writes a row to the matching tab of
 * the Kaushal Hub Google Sheet. The request is sent as `application/x-www-form-urlencoded`, a
 * "simple" request, so the browser does not need a CORS preflight that Apps Script cannot answer.
 *
 * If FORMS_ENDPOINT is ever emptied, submissions are not sent anywhere and the forms say so plainly.
 */

/**
 * The Apps Script web app URL (ends in `/exec`). Public by design: it only accepts form posts.
 * After editing the script, redeploy as a new version of the same deployment so this URL stays
 * the same. VITE_FORMS_ENDPOINT can override it for local testing.
 */
export const FORMS_ENDPOINT: string =
  import.meta.env["VITE_FORMS_ENDPOINT"] ??
  "https://script.google.com/macros/s/AKfycbx9LlpjGMhMv1y4-ENAP4ysSczLIFL2qMz6VG2f8i6CTWMEkJCRX5iX61GyV1O9JqE/exec";

export type FormKind = "contact" | "community";

/** Hidden field only bots fill in. Named like a real field so they take the bait. */
export const HONEYPOT_FIELD = "company_website";
/** A person needs at least this long to fill in a form; anything faster is treated as a bot. */
const MIN_FILL_MS = 2000;
const MAX_FIELD_LENGTH = 5000;

export class FormNotConnectedError extends Error {
  constructor() {
    super("Form submissions are not connected yet.");
  }
}

/**
 * Sends a form. Resolves when the submission was stored; throws FormNotConnectedError before the
 * backend is configured and a plain Error when sending fails. Bot submissions resolve silently
 * without being sent, so bots get no signal to retry.
 */
export async function submitForm(kind: FormKind, form: HTMLFormElement, startedAt: number) {
  const data = new FormData(form);
  const honeypot = data.get(HONEYPOT_FIELD);
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || Date.now() - startedAt < MIN_FILL_MS) return;

  if (!FORMS_ENDPOINT) throw new FormNotConnectedError();

  const body = new URLSearchParams();
  body.set("formType", kind);
  body.set("page", window.location.pathname + window.location.search);
  for (const [name, value] of data) {
    if (name === HONEYPOT_FIELD || typeof value !== "string") continue;
    body.append(name, value.trim().slice(0, MAX_FIELD_LENGTH));
  }

  const response = await fetch(FORMS_ENDPOINT, { method: "POST", body });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) throw new Error(result?.error ?? `Submission failed (${response.status})`);
}

/** Contact form enquiry types. `key` is what pages pass as `/contact?interest=<key>` to preselect one. */
export const enquiryTypes = [
  { key: "general", label: "General enquiry" },
  { key: "experience-to-enterprise", label: "Experience to Enterprise (12-week program)" },
  { key: "entrepreneurship-for-school-students", label: "Entrepreneurship for School Students" },
  { key: "entrepreneurship-for-undergraduates", label: "Entrepreneurship for Undergraduate Students" },
  { key: "generative-ai-in-action", label: "Microsoft AI Course (Generative AI in Action)" },
  { key: "partnership", label: "Partnership or collaboration" },
  { key: "institutional", label: "Institutional or corporate enquiry" },
  { key: "media", label: "Media or other enquiry" },
] as const;

export type EnquiryKey = (typeof enquiryTypes)[number]["key"];

export function enquiryLabel(key: string | undefined) {
  return enquiryTypes.find((type) => type.key === key)?.label;
}
