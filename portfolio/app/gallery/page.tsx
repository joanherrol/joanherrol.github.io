import { LocaleProvider } from "@/lib/i18n";
import { BackNavbar } from "@/components/shared/back-navbar";
import { Gallery } from "@/components/portfolio-sections/gallery";
import { Footer } from "@/components/shared/footer";

export default function GalleryPage() {
  return (
    <LocaleProvider>
      <div className="flex flex-col min-h-screen">
        <BackNavbar backTo="/#about" />
        <main className="flex-1">
          <Gallery />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
