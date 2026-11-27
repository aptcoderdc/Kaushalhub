import { useRef, useState, type FormEvent } from "react";
import { HONEYPOT_FIELD, FormNotConnectedError, submitForm, type FormKind } from "@/lib/forms";

export type FormStatus = "idle" | "sending" | "sent" | "error" | "not-connected";

/** Submit handling shared by the website forms: validation, sending state and the outcome. */
export function useFormSubmit(kind: FormKind) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const startedAt = useRef(Date.now());

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (status === "sending" || !form.reportValidity()) return;
    setStatus("sending");
    try {
      await submitForm(kind, form, startedAt.current);
      setStatus("sent");
    } catch (error) {
      setStatus(error instanceof FormNotConnectedError ? "not-connected" : "error");
    }
  };

  /** Back to an empty form, e.g. "Send another message". */
  const reset = () => {
    startedAt.current = Date.now();
    setStatus("idle");
  };

  return { status, onSubmit, reset, sending: status === "sending" };
}

/** Invisible to people (off-screen, skipped by keyboard and screen readers); bots fill it in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** The message shown under a form when sending did not succeed. */
export function FormProblem({ status, fallback }: { status: FormStatus; fallback: string }) {
  if (status !== "error" && status !== "not-connected") return null;
  return (
    <p role="alert" className="kh-panel rounded-lg border border-saffron/40 bg-saffron/10 p-4 text-small leading-6 text-navy md:col-span-2">
      {status === "not-connected"
        ? `Online submissions are not switched on yet, so your details have not been sent or saved. ${fallback}`
        : `Something went wrong and your details were not sent. Please try again in a moment. ${fallback}`}
    </p>
  );
}
