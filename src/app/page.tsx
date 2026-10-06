import Hero from "@/components/sections/Hero";
import HeroStats from "@/components/sections/HeroStats";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import WhyKsb from "@/components/sections/WhyKsb";
import Materials from "@/components/sections/Materials";
import Testimonials from "@/components/sections/Testimonials";
import FinalCta from "@/components/sections/FinalCta";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HeroStats />
      <About />
      <Services />
      <Projects />
      <Process />
      <WhyKsb />
      <Materials />
      <Testimonials />
      <FinalCta />
      <Contact />
    </>
  );
}
