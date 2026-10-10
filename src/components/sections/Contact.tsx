"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { siteConfig, whatsappUrl } from "@/lib/site.config";

const PROJECT_TYPES = [
  "Residential Construction",
  "Commercial Construction",
  "Renovation & Remodelling",
  "Architectural Planning",
  "2D & 3D Design",
  "Structural & Civil Works",
  "Other",
];

const PLOT_STATUS = [
  "Land / plot ready",
  "Land to be finalised",
  "Existing building (renovation)",
  "Not decided yet",
];

const BUDGETS = [
  "Under ₹25 Lakh",
  "₹25 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "₹1 Crore – ₹2 Crore",
  "₹2 Crore and above",
  "To be discussed",
];

type Status = "idle" | "sending" | "sent" | "whatsapp" | "error";

const fieldBase =
  "w-full border-b border-bone/20 bg-transparent py-3 text-base text-bone outline-none transition-colors duration-300 placeholder:text-mist-dim/70 focus:border-copper";
const labelBase = "label-xs mb-2 block text-mist-dim";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelBase}>
        {label}
        {required ? <span className="ml-1 text-copper">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    plotStatus: "",
    location: "",
    budget: "",
    message: "",
  });

  const update = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const composedMessage = () =>
    [
      "New project enquiry — KSB Constructions",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      `Project type: ${form.projectType || "—"}`,
      form.plotStatus && `Plot / property status: ${form.plotStatus}`,
      `Location: ${form.location || "—"}`,
      `Approximate budget: ${form.budget || "—"}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and a phone number so we can reach you.");
      setStatus("error");
      return;
    }

    setError("");

    if (siteConfig.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(siteConfig.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...form, source: "ksbconstructions-website" }),
        });
        if (!res.ok) throw new Error("request failed");
        setStatus("sent");
        return;
      } catch {
        // fall through to the WhatsApp path below
      }
    }

    window.open(
      whatsappUrl(composedMessage()),
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("whatsapp");
  }

  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-ink">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-copper/15 blur-[150px]"
        aria-hidden="true"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ------------------------------------------------------- left */}
        <div className="lg:col-span-5">
          <p className="eyebrow mb-7" data-reveal>
            <span className="mr-3 inline-block h-px w-8 bg-copper align-middle" />
            Contact
          </p>

          <h2 className="display-lg text-bone">
            <span data-reveal-line className="block">
              <span>LET&apos;S BUILD</span>
            </span>
            <span data-reveal-line className="block">
              <span className="text-copper-deep">TOGETHER.</span>
            </span>
          </h2>

          <p className="lead mt-7 max-w-md !text-[0.95rem]" data-reveal>
            Tell us about your site, your timeline and what you want to build —
            we will come back with a clear next step.
          </p>

          {/* contact rows */}
          <dl className="mt-10 divide-y divide-bone/10 border-y border-bone/10" data-reveal>
            <div className="flex items-start gap-4 py-4">
              <dt className="label-xs w-20 shrink-0 text-copper/70">Location</dt>
              <dd className="text-sm text-bone">{siteConfig.addressDisplay}</dd>
            </div>
            <div className="flex items-start gap-4 py-4">
              <dt className="label-xs w-20 shrink-0 text-copper/70">Phone</dt>
              <dd>
                <a
                  href={siteConfig.phoneHref}
                  className="text-sm text-bone transition-colors duration-300 hover:text-copper"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="flex items-start gap-4 py-4">
              <dt className="label-xs w-20 shrink-0 text-copper/70">Email</dt>
              <dd className="min-w-0">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-sm text-bone transition-colors duration-300 hover:text-copper"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div className="flex items-start gap-4 py-4">
              <dt className="label-xs w-20 shrink-0 text-copper/70">WhatsApp</dt>
              <dd>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone transition-colors duration-300 hover:text-copper"
                >
                  Chat with us →
                </a>
              </dd>
            </div>
          </dl>

          {/* hours */}
          <div className="mt-6 space-y-1" data-reveal>
            {siteConfig.hours.map((h) => (
              <p key={h.days} className="text-xs text-mist-dim">
                <span className="text-mist">{h.days}</span> — {h.time}
              </p>
            ))}
          </div>

          {/* map */}
          <div
            className="mt-9 overflow-hidden border border-bone/12"
            data-reveal
            data-cursor="image"
          >
            <iframe
              src={siteConfig.mapEmbedUrl}
              title={`Map — ${siteConfig.addressDisplay}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full grayscale-[0.25] sepia-[0.12] contrast-[1.02]"
            />
            <a
              href={siteConfig.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label-xs flex items-center justify-between border-t border-bone/12 px-4 py-3 text-mist-dim transition-colors duration-300 hover:text-copper"
            >
              Open in Google Maps
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* ------------------------------------------------------ right */}
        <div className="lg:col-span-6 lg:col-start-7" data-reveal>
          <div className="relative border border-bone/12 bg-ink-soft/70 p-6 backdrop-blur-sm sm:p-9">
            <span
              className="pointer-events-none absolute right-6 top-3 select-none font-display text-[5rem] leading-none text-bone/[0.05]"
              aria-hidden="true"
            >
              KSB
            </span>

            <p className="label-xs mb-8 text-copper">Project enquiry</p>

            {status === "sent" || status === "whatsapp" ? (
              <div className="py-8">
                <h3 className="text-2xl font-bold uppercase tracking-[0.06em] text-bone">
                  {status === "sent" ? "Enquiry received." : "Almost there."}
                </h3>
                <p className="lead mt-4 !text-[0.95rem]">
                  {status === "sent"
                    ? "Thank you — our team will get back to you shortly."
                    : "Your enquiry has been prepared in WhatsApp. Press send in the WhatsApp window and our team will respond."}
                </p>
                {status === "whatsapp" ? (
                  <a
                    href={whatsappUrl(composedMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-7"
                  >
                    Re-open WhatsApp
                    <span className="btn-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      projectType: "",
                      plotStatus: "",
                      location: "",
                      budget: "",
                      message: "",
                    });
                  }}
                  className="mt-6 block text-xs uppercase tracking-[0.2em] text-mist-dim underline-offset-8 transition-colors duration-300 hover:text-copper hover:underline"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Name" required>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => update("name")(e.target.value)}
                      className={fieldBase}
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(e) => update("phone")(e.target.value)}
                      className={fieldBase}
                    />
                  </Field>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Email">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update("email")(e.target.value)}
                      className={fieldBase}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      type="text"
                      name="location"
                      placeholder="Trichy, Tamil Nadu"
                      value={form.location}
                      onChange={(e) => update("location")(e.target.value)}
                      className={fieldBase}
                    />
                  </Field>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Project type">
                    <select
                      name="projectType"
                      value={form.projectType}
                      onChange={(e) => update("projectType")(e.target.value)}
                      className={`${fieldBase} appearance-none [&>option]:bg-ink-deep`}
                    >
                      <option value="">Select a service</option>
                      {PROJECT_TYPES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Plot / property status">
                    <select
                      name="plotStatus"
                      value={form.plotStatus}
                      onChange={(e) => update("plotStatus")(e.target.value)}
                      className={`${fieldBase} appearance-none [&>option]:bg-ink-deep`}
                    >
                      <option value="">Select status</option>
                      {PLOT_STATUS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Approximate budget">
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={(e) => update("budget")(e.target.value)}
                    className={`${fieldBase} appearance-none [&>option]:bg-ink-deep`}
                  >
                    <option value="">Select a range</option>
                    {BUDGETS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Message">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about the site, size and timeline…"
                    value={form.message}
                    onChange={(e) => update("message")(e.target.value)}
                    className={`${fieldBase} resize-none`}
                  />
                </Field>

                {status === "error" && error ? (
                  <p className="border-l-2 border-copper pl-3 text-sm text-copper-deep">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-primary w-full !py-4 disabled:opacity-60 sm:w-auto"
                  >
                    {status === "sending" ? "Sending…" : "Send project enquiry"}
                    <span className="btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <p className="text-[0.7rem] leading-relaxed text-mist-dim sm:max-w-[22ch]">
                    We reply within one working day.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
