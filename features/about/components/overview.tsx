export function Overview() {
  return (
    <section
      id="our-purpose"
      aria-labelledby="purpose-title"
      className="scroll-mt-24"
    >
      <div className="mx-auto w-[90%] py-24 lg:py-32">
        <div className="page-reveal mx-auto max-w-4xl text-center">
          <h2
            id="purpose-title"
            className="font-heading text-3xl leading-snug text-brand-cream"
          >
            Personal growth begins with the space to listen to yourself.
          </h2>
        </div>
        <div className="page-reveal mx-auto mt-14 grid max-w-7xl gap-5 md:grid-cols-3">
          <div className="card-plain p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-lavender">
              Our mission
            </p>
            <p className="mt-4 leading-relaxed">
              A calm, supportive and spiritually oriented space for learning,
              self-reflection, meditation and complementary healing practices.
            </p>
          </div>
          <div className="card-plain p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-lavender">
              Our approach
            </p>
            <p className="mt-4 leading-relaxed">
              Through spiritual healing, energy work, hypnotherapy and spiritual
              education, we invite you to explore with curiosity, care and
              respect for your own journey.
            </p>
          </div>
          <div className="card-plain p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-lavender">
              Our promise
            </p>
            <p className="mt-4 leading-relaxed">
              A respectful, peaceful and professional environment for spiritual
              learning and personal growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
