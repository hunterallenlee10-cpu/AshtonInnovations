"use client";

import { useId, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { business, CTA_LABEL, projectTypes, type ProjectType } from "@/data/business";
import { Confirm } from "@/components/ui/Confirm";

const roles = ["Homeowner", "Builder", "Business"] as const;
const timelines = [
  "As soon as possible",
  "Within 3 months",
  "3 to 6 months",
  "6 months or more",
  "Just planning",
] as const;

type Values = {
  role: (typeof roles)[number] | "";
  name: string;
  phone: string;
  email: string;
  town: string;
  projects: ProjectType[];
  timeline: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.role) e.role = "Choose the option that fits you best.";
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  const digits = v.phone.replace(/\D/g, "");
  if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))
    e.phone = "Enter a 10-digit phone number, e.g. (540) 555-0123.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.projects.length === 0) e.projects = "Pick at least one, or choose Not sure.";
  if (!v.timeline) e.timeline = "Choose a rough timeline.";
  return e;
}

const fieldBase =
  "w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-[17px] text-ink placeholder:text-ink/60 transition-colors focus:border-ink focus:outline-none focus-visible:outline-none";

export function ConsultForm({
  preselect,
  onDone,
  variant = "page",
}: {
  preselect?: ProjectType;
  onDone?: () => void;
  variant?: "modal" | "page";
}) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>({
    role: "",
    name: "",
    phone: "",
    email: "",
    town: "",
    projects: preselect ? [preselect] : [],
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const toggleProject = (p: ProjectType) => {
    const has = values.projects.includes(p);
    set("projects", has ? values.projects.filter((x) => x !== p) : [...values.projects, p]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    const firstBad = Object.keys(errs)[0];
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus();
      return;
    }
    // Concept demo: nothing is sent anywhere.
    setSent(true);
  };

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`${id(k)}-err`} className="mt-2 text-[14px] text-red" role="alert">
        {errors[k]}
      </p>
    ) : null;

  if (sent) {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="py-6"
        role="status"
        aria-live="polite"
      >
        <svg viewBox="0 0 240 60" className="h-14 w-auto text-ink" aria-hidden="true">
          <path d="M2 58 H238" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M20 58 V20 H220 V58" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M40 58 V34 H200 V58" stroke="var(--red)" strokeWidth="1.5" fill="none" />
        </svg>
        <h3 className="display mt-8 text-[clamp(2.4rem,5vw,3.6rem)]">Thank you, {first}.</h3>
        <p className="mt-5 max-w-[42ch] text-[18px] leading-relaxed">
          <Confirm>We’ll call you within one business day</Confirm> to talk through your
          project. If it can’t wait, call the office at{" "}
          <a href={business.phone.href} className="underline decoration-red underline-offset-4">
            {business.phone.display}
          </a>
          .
        </p>
        <p className="annot mt-8 text-muted">
          Concept preview: this form does not send anything yet.
        </p>
        {variant === "modal" && onDone && (
          <button type="button" onClick={onDone} className="btn-red mt-10">
            Close
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-9">
      <fieldset>
        <legend id={id("role")} tabIndex={-1} className="annot text-muted">
          I’m a
        </legend>
        <div className="mt-3 grid grid-cols-3 border border-line-strong" role="radiogroup" aria-labelledby={id("role")}>
          {roles.map((r, i) => {
            const on = values.role === r;
            return (
              <label
                key={r}
                className={`relative flex min-h-12 cursor-pointer items-center justify-center px-2 text-[15px] transition-colors ${
                  i > 0 ? "border-l border-line-strong" : ""
                } ${on ? "bg-ink text-plaster" : "hover:bg-plaster-2"}`}
              >
                <input
                  type="radio"
                  name={`${uid}-role`}
                  value={r}
                  checked={on}
                  onChange={() => set("role", r)}
                  className="peer sr-only"
                  data-autofocus={i === 0 ? "" : undefined}
                />
                <span className="peer-focus-visible:underline peer-focus-visible:decoration-red peer-focus-visible:decoration-2 peer-focus-visible:underline-offset-4">
                  {r}
                </span>
              </label>
            );
          })}
        </div>
        {err("role")}
      </fieldset>

      <div className="grid gap-9 sm:grid-cols-2">
        {(
          [
            ["name", "Name", "text", "name"],
            ["phone", "Phone", "tel", "tel"],
            ["email", "Email", "email", "email"],
            ["town", "Town (optional)", "text", "address-level2"],
          ] as const
        ).map(([k, label, type, auto]) => (
          <div key={k}>
            <label htmlFor={id(k)} className="annot text-muted">
              {label}
            </label>
            <input
              id={id(k)}
              type={type}
              autoComplete={auto}
              value={values[k]}
              onChange={(e) => set(k, e.target.value)}
              aria-invalid={!!errors[k]}
              aria-describedby={errors[k] ? `${id(k)}-err` : undefined}
              className={fieldBase}
            />
            {err(k)}
          </div>
        ))}
      </div>

      <fieldset>
        <legend id={id("projects")} tabIndex={-1} className="annot text-muted">
          Project type (choose any)
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {projectTypes.map((p) => {
            const on = values.projects.includes(p);
            return (
              <label
                key={p}
                className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 border px-4 text-[15px] transition-colors ${
                  on ? "border-ink bg-ink text-plaster" : "border-line-strong hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleProject(p)}
                  className="peer sr-only"
                />
                {on && <Check size={14} weight="bold" aria-hidden="true" />}
                <span className="peer-focus-visible:underline peer-focus-visible:decoration-red peer-focus-visible:decoration-2 peer-focus-visible:underline-offset-4">
                  {p}
                </span>
              </label>
            );
          })}
        </div>
        {err("projects")}
      </fieldset>

      <div>
        <label htmlFor={id("timeline")} className="annot text-muted">
          Timeline
        </label>
        <select
          id={id("timeline")}
          value={values.timeline}
          onChange={(e) => set("timeline", e.target.value)}
          aria-invalid={!!errors.timeline}
          aria-describedby={errors.timeline ? `${id("timeline")}-err` : undefined}
          className={`${fieldBase} cursor-pointer appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='8'><path d='M1 1l6 6 6-6' stroke='%23141414' fill='none'/></svg>")] bg-[length:14px_8px] bg-[position:right_4px_center] bg-no-repeat pr-8`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {timelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {err("timeline")}
      </div>

      <div>
        <label htmlFor={id("message")} className="annot text-muted">
          Message (optional)
        </label>
        <textarea
          id={id("message")}
          rows={4}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="The room, the style of home, anything you’ve seen and liked."
          className={`${fieldBase} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="submit" className="btn-red">
          {CTA_LABEL}
          <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
        </button>
        <p className="text-[15px] text-muted">
          Or call{" "}
          <a href={business.phone.href} className="text-ink underline decoration-red underline-offset-4">
            {business.phone.display}
          </a>
        </p>
      </div>
    </form>
  );
}
