import { ContactHero } from "./ContactHero";
import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import { ContactFAQ } from "./ContactFAQ";

export function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <ContactHero />
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
      <ContactFAQ />
    </main>
  );
}