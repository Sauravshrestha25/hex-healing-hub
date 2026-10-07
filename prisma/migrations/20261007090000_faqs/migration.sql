-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Faq_published_order_idx" ON "Faq"("published", "order");

-- One-time import of the questions that were hard-coded on the site (adapted from the FAQ on
-- hexhealinghubpokhara.com). Runs once, so deleting one later won't bring it back.
INSERT INTO "Faq" ("id", "question", "answer", "published", "order", "updatedAt") VALUES
  ('launch-faq-01', 'What is energy healing, and how does it work?', 'Energy healing works with the body''s natural energy systems to help release blockages, ease tension, and restore balance. Many clients describe feeling lighter, calmer, and more emotionally clear after a session.', true, 1, CURRENT_TIMESTAMP),
  ('launch-faq-02', 'Is hypnotherapy safe?', 'Yes. Hypnotherapy is a guided, relaxed state of focused attention — you remain fully aware and in control throughout. It''s used to help access the subconscious mind and gently work through patterns, habits, or emotional blocks at their root.', true, 2, CURRENT_TIMESTAMP),
  ('launch-faq-03', 'Do I need to believe in energy healing for it to work?', 'Not necessarily. Many clients come with curiosity rather than certainty, and results often speak for themselves. That said, an open mind tends to help you get the most from the experience.', true, 3, CURRENT_TIMESTAMP),
  ('launch-faq-04', 'What can I expect in my first session?', 'Your first visit usually starts with a conversation — understanding what you''re going through and what you''re hoping to work on — before moving into the session itself. There''s no set script; sessions are shaped around you.', true, 4, CURRENT_TIMESTAMP),
  ('launch-faq-05', 'How many sessions will I need?', 'This varies from person to person. Some clients feel significant shifts after a single session, while others benefit from a short series of sessions spaced over days or weeks.', true, 5, CURRENT_TIMESTAMP),
  ('launch-faq-06', 'Can these sessions help with anxiety, depression, or insomnia?', 'Many clients have come to us specifically for support with anxiety, depression, overthinking, insomnia, and panic attacks, and have reported meaningful improvement. That said, this isn''t a replacement for medical or psychiatric treatment.', true, 6, CURRENT_TIMESTAMP),
  ('launch-faq-07', 'What''s the difference between online and in-person sessions?', 'In-person sessions take place at our centres and include hands-on energy work, sound healing, and face-to-face hypnotherapy. Online sessions are guided remotely and offer the same depth of attention for anyone who can''t visit in person.', true, 7, CURRENT_TIMESTAMP),
  ('launch-faq-08', 'Do online sessions actually work as well as in-person ones?', 'Yes — many clients based outside Pokhara, or even outside Nepal, have had strong results with online energy healing and hypnotherapy sessions.', true, 8, CURRENT_TIMESTAMP),
  ('launch-faq-09', 'Can I train to do this work myself?', 'Yes. We offer hypnosis and energy healing training for those who want to deepen their own personal practice or begin working with others.', true, 9, CURRENT_TIMESTAMP),
  ('launch-faq-10', 'What are your hours, and do I need an appointment?', 'Our Pokhara centre is open daily from 11am to 5pm. It''s best to book a session online or call ahead on 9867187726 to make sure a time is available.', true, 10, CURRENT_TIMESTAMP),
  ('launch-faq-11', 'Where are you located?', 'Our Pokhara centre is on Lakeside Rd, Pokhara, Gandaki Province 33700. We also have centres in Butwal (9705223335) and Kapilvastu (9700063356).', true, 11, CURRENT_TIMESTAMP);
