import { getFaqs } from "@/features/content/server/queries";

/** Common questions, as a native disclosure list (works without JS, keyboard accessible). */
export async function Faq() {
  const faqs = await getFaqs();
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-title">
      <div className="mx-auto w-[90%] max-w-5xl py-24 lg:py-32">
        <div className="page-reveal mb-12 text-center">
          <h2 id="faq-title" className="font-heading text-3xl leading-tight text-brand-cream in-[.section-cream]:text-brand-purple">
            Questions, gently answered.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-lavender">
            Anything else on your mind? Message us on WhatsApp or book a first conversation.
          </p>
        </div>
        <div className="page-reveal grid gap-3">
          {faqs.map((item) => (
            <details key={item.id} className="card-plain group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-heading text-lg">
                {item.question}
                <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-lavender">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
