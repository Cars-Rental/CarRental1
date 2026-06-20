import {
  HeroSection,
  StatsSection,
  HowItWorks,
  WhyChooseUs,
  FeaturedCars,
  FAQSection,
} from "@/features/landing";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <StatsSection locale={locale} />
      <HowItWorks locale={locale} />
      <FeaturedCars locale={locale} mode="rent" />
      <FeaturedCars locale={locale} mode="buy" />
      <WhyChooseUs locale={locale} />
      <FAQSection locale={locale} />
    </>
  );
}
