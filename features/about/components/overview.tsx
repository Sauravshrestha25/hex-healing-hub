export function Overview() {
  return (
    <section id="our-purpose" aria-labelledby="purpose-title" className="scroll-mt-24 border-y hairline-gold">
      <div className="mx-auto w-[90%] py-24 lg:py-36">
        <div className="page-reveal">
          <h2 id="purpose-title" className="max-w-4xl font-heading text-3xl leading-snug sm:text-4xl lg:text-5xl">
            Personal growth begins with the space to <span className="text-gold-light">listen to yourself.</span>
          </h2>
          <div className="mt-10 grid gap-8 text-sm leading-loose text-lavender sm:grid-cols-2 sm:gap-12 sm:text-base">
            <p>
              Our mission is to provide a calm, supportive and spiritually oriented space for learning,
              self-reflection, meditation and complementary healing practices.
            </p>
            <p>
              Through spiritual healing, energy work, hypnotherapy and spiritual education, we invite
              you to explore with curiosity, care and respect for your own journey.
            </p>
          </div>
          <div className="mt-12 border-l border-gold/50 pl-6">
            <p className="text-sm font-medium text-gold-light">Our promise</p>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ivory/90">
              A respectful, peaceful and professional environment for spiritual learning and personal growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
