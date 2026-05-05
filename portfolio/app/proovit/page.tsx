import { Navbar } from "@/components/shared/navbar";
import { ShowcaseSection } from "@/components/proovit-sections/showcase-section";
import { FunctionalitySection } from "@/components/proovit-sections/functionality-section";
import { TechSection } from "@/components/proovit-sections/tech-section";
import { DesignSection } from "@/components/proovit-sections/design-section";
import { Footer } from "@/components/shared/footer";

export default function ProovitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        leftType="back"
        backTo="/#projects"
        links={[
          { id: "showcase" },
          { id: "functionality" },
          { id: "design" },
          { id: "tech" },
        ]}
        labelGroup="proovit"
        initialActiveId="showcase"
      />
      <main className="flex-1">
        <ShowcaseSection />
        <FunctionalitySection />
        <DesignSection />
        <TechSection />
      </main>
      <Footer />
    </div>
  );
}
