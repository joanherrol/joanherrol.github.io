import { LocaleProvider } from "@/lib/i18n";
import { Navbar } from "@/components/shared/navbar";
import { Hero } from "@/components/portfolio-sections/hero";
import { About } from "@/components/portfolio-sections/about";
import { Projects } from "@/components/portfolio-sections/projects";
import { Skills } from "@/components/portfolio-sections/skills";
import { Education } from "@/components/portfolio-sections/education";
import { Contact } from "@/components/portfolio-sections/contact";
import { Footer } from "@/components/shared/footer";

export default function Home() {
  return (
    <LocaleProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
