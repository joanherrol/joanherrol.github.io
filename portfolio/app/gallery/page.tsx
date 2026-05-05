import { Navbar } from "@/components/shared/navbar";
import { Gallery } from "@/components/portfolio-sections/gallery";
import { Footer } from "@/components/shared/footer";

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar leftType="back" backTo="/#about" />
      <main className="flex-1">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
