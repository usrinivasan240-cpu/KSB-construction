import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { adjacentProjects, getProject, projects } from "@/lib/content";
import { siteConfig } from "@/lib/site.config";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const description = `${project.title} — ${project.type} by KSB Constructions in ${project.location}. ${project.summary}`;

  return {
    title: `${project.title}, ${project.location}`,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | KSB Constructions`,
      description,
      images: [{ url: project.image, alt: project.title }],
    },
  };
}

const BLOCKS = [
  { key: "brief", label: "The brief" },
  { key: "approach", label: "The approach" },
  { key: "construction", label: "Construction" },
  { key: "details", label: "Details" },
  { key: "result", label: "Final result" },
] as const;

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { next } = adjacentProjects(slug);
  const gallery = project.gallery ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.image,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    about: project.type,
  };

  return <article className="relative bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ============================================================ HERO */}
      <header className="noise-layer relative flex min-h-[78svh] flex-col justify-end overflow-hidden bg-ink-deep pb-14 pt-[calc(var(--header-h)+3rem)]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.title} — ${project.type}`}
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,11,16),0.9)_0%,rgba(6,11,16),0.4)_42%,rgba(6,11,16),0.97)_100%)]" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="shell relative z-10">
          <Link
            href="/#projects"
            className="group label-xs mb-9 inline-flex items-center gap-3 text-[#B7AB96] transition-colors duration-300 hover:text-copper-light"
          >
            <span
              className="inline-block transition-transform duration-400 group-hover:-translate-x-1.5"
              aria-hidden="true"
            >
              ←
            </span>
            All projects
          </Link>

          <p className="label-xs mb-5 text-copper-light">{project.type}</p>

          <h1 className="display-xl max-w-[18ch] text-[#F6EFE3]" data-reveal-line>
            <span>{project.title}</span>
          </h1>

          <dl className="mt-10 grid gap-px border border-bone/15 bg-bone/10 sm:grid-cols-3">
            <div className="bg-[#0A1118]/85 p-5 backdrop-blur-sm">
              <dt className="label-xs text-copper/70">Location</dt>
              <dd className="mt-2 text-sm uppercase tracking-[0.16em] text-[#F6EFE3]">
                {project.location}
              </dd>
            </div>
            <div className="bg-[#0A1118]/85 p-5 backdrop-blur-sm">
              <dt className="label-xs text-copper/70">Project type</dt>
              <dd className="mt-2 text-sm uppercase tracking-[0.16em] text-[#F6EFE3]">
                {project.type}
              </dd>
            </div>
            <div className="bg-[#0A1118]/85 p-5 backdrop-blur-sm">
              <dt className="label-xs text-copper/70">Status</dt>
              <dd className="mt-2 text-sm uppercase tracking-[0.16em] text-[#F6EFE3]">
                {project.status}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* ========================================================= SUMMARY */}
      <section className="border-b border-bone/10 bg-ink">
        <div className="shell-narrow py-16 sm:py-24">
          <p className="lead !text-[1.15rem] !leading-[1.7] !text-[#3A3128]" data-reveal>
            {project.summary}
          </p>
        </div>
      </section>

      {/* =========================================================== BODY */}
      <div className="bg-ink">
        {BLOCKS.map((block, i) => (
          <div key={block.key}>
            <section className="shell-narrow grid gap-6 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="eyebrow sticky top-[calc(var(--header-h-sm)+1.5rem)] flex items-center gap-3" data-reveal>
                  <span className="inline-block h-px w-6 bg-copper" aria-hidden="true" />
                  {block.label}
                </p>
              </div>
              <div className="lg:col-span-8">
                <p className="text-[1.05rem] leading-[1.85] text-mist" data-reveal>
                  {project[block.key]}
                </p>
                <span className="accent-rule mt-8 block" aria-hidden="true" />
              </div>
            </section>

            {gallery[i] ? (
              <figure className="mask-reveal relative w-full overflow-hidden">
                <div className="relative h-[52vh] min-h-[22rem] w-full sm:h-[70vh]">
                  <Image
                    src={gallery[i]}
                    alt={`${project.title} — ${block.label}`}
                    fill
                    sizes="100vw"
                    quality={80}
                    className="object-cover"
                    data-reveal-img
                  />
                </div>
                <figcaption className="label-xs absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,transparent,rgba(6,11,16),0.9))] p-5 text-[#B9AE9C] sm:p-7">
                  {project.title} — {block.label}
                </figcaption>
              </figure>
            ) : null}
          </div>
        ))}
      </div>

      {/* ============================================================ FOOT */}
      <nav
        aria-label="Project navigation"
        className="border-t border-bone/10 bg-ink-deep"
      >
        <div className="shell grid gap-px bg-bone/10 sm:grid-cols-2">
          <Link
            href="/#projects"
            className="group flex items-center justify-between gap-6 bg-ink-deep p-7 transition-colors duration-500 hover:bg-ink-soft sm:p-10"
          >
            <span>
              <span className="label-xs block text-copper/70">Back</span>
              <span className="mt-2 block text-lg font-bold uppercase tracking-[0.1em] text-bone transition-transform duration-500 group-hover:-translate-x-1.5">
                ← All projects
              </span>
            </span>
          </Link>

          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between gap-6 bg-ink-deep p-7 text-right transition-colors duration-500 hover:bg-ink-soft sm:p-10"
          >
            <span className="ml-auto">
              <span className="label-xs block text-copper/70">Next project</span>
              <span className="mt-2 block text-lg font-bold uppercase tracking-[0.1em] text-bone transition-transform duration-500 group-hover:translate-x-1.5">
                {next.title} →
              </span>
            </span>
          </Link>
        </div>
      </nav>
    </article>;
}
