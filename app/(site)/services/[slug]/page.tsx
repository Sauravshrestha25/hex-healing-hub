import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitizeBlogHtml } from "@/features/content/lib/sanitize";
import { getService, getServices } from "@/features/content/server/queries";
import { PageClosing } from "@/features/shared/components/page-closing";
import { PageMotion } from "@/features/shared/components/page-motion";

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.description };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) notFound();
  const others = (await getServices()).filter((other) => other.slug !== service.slug).slice(0, 3);
  const body = sanitizeBlogHtml(service.content);
  const hasBody = body.replace(/<[^>]+>/g, "").trim().length > 0;

  return (
    <PageMotion>
      <article>
        <header className="bg-[radial-gradient(ellipse_at_top_right,#243B8F44,transparent_65%)]">
          <div className="page-reveal mx-auto w-[90%] max-w-5xl pb-12 pt-32 sm:pt-40 lg:pb-16">
            <Link href="/services" className="inline-flex items-center gap-3 py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">
              <span aria-hidden="true">←</span> All Services
            </Link>
            <h1 className="mt-9 font-heading text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">{service.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-lavender sm:text-xl">{service.description}</p>
          </div>
        </header>
        <div className="page-reveal relative mx-auto aspect-[16/10] w-[90%] max-w-6xl overflow-hidden sm:aspect-[21/9]">
          <Image src={service.image} alt="" fill preload sizes="(min-width: 1280px) 1152px, 90vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        </div>
        <div className="mx-auto w-[90%] max-w-3xl py-14 lg:py-20">
          {hasBody && (
            <div className="page-reveal blog-body text-base leading-loose text-ivory/85 sm:text-lg" dangerouslySetInnerHTML={{ __html: body }} />
          )}
          <div className={`page-reveal flex flex-col justify-between gap-4 border-t hairline-gold pt-7 sm:flex-row sm:items-center ${hasBody ? "mt-10" : ""}`}>
            <p className="text-sm text-lavender">Have a question about {service.title.toLowerCase()}?</p>
            <Link href="/contact" className="w-fit py-2 text-sm text-gold-light">
              Ask About This Practice <span aria-hidden="true" className="ml-3">↗</span>
            </Link>
          </div>
          <p className="page-reveal mt-10 border-l border-gold/40 pl-6 text-sm leading-relaxed text-lavender">
            Our services are complementary and supportive. They do not replace professional medical or psychological care, and
            individual experiences vary.
          </p>
        </div>
      </article>

      {others.length > 0 && (
        <section aria-labelledby="other-services-title" className="border-t hairline-gold bg-purple/20">
          <div className="mx-auto w-[90%] py-20 lg:py-28">
            <div className="page-reveal mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <h2 id="other-services-title" className="font-heading text-3xl sm:text-4xl">Other ways <span className="text-gold-light">we can help.</span></h2>
              <Link href="/services" className="w-fit py-3 text-sm text-gold-light underline decoration-gold/40 underline-offset-8">
                View All Services <span aria-hidden="true" className="ml-3">↗</span>
              </Link>
            </div>
            <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
              {others.map((other) => (
                <Link key={other.id} href={`/services/${other.slug}`} className="page-reveal group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-purple">
                    <Image src={other.image} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl group-hover:text-gold-light sm:text-2xl">{other.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-lavender">{other.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageClosing title="Not sure where" emphasis="to begin?" body="Tell us what you're looking for and we'll help you understand the options." label="Talk to HEX" />
    </PageMotion>
  );
}
