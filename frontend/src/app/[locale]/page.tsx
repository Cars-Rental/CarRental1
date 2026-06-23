import {
  HeroSection,
  StatsSection,
  HowItWorks,
  WhyChooseUs,
  FeaturedCars,
  FAQSection,
} from "@/features/landing";

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturedCars mode="rent" />
      <FeaturedCars mode="buy" />
      <WhyChooseUs />
      <FAQSection />
    </>
  );
}
