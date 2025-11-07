import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ValueProps from "@/components/home/ValueProps";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CategoryShowcase />
      <ValueProps />
      <CTASection />
      <Footer />
    </>
  );
}
