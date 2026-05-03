import { LocaleProvider } from "@/lib/i18n";
import { BackNavbar } from "@/components/shared/back-navbar";
import { ShowcaseSection } from "@/components/proovit-sections/showcase-section";
import { FunctionalitySection } from "@/components/proovit-sections/functionality-section";
import { TechSection } from "@/components/proovit-sections/tech-section";
import { DesignSection } from "@/components/proovit-sections/design-section";
import { Footer } from "@/components/shared/footer";

export default function ProovitPage() {
  return (
    <LocaleProvider>
      <div className="flex flex-col min-h-screen">
        <BackNavbar
          backTo="/#projects"
          sectionLinks={["showcase", "functionality", "design", "tech"]}
        />
        <main className="flex-1">
          <ShowcaseSection />
          <FunctionalitySection />
          <DesignSection />
          <TechSection />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
