import { LocaleProvider } from "@/lib/i18n";
import { BackNavbar } from "@/components/back-navbar";
import { Gallery } from "@/components/gallery";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Gallery — Joan Hervás",
  description: "A collection of digital and traditional paintings by Joan Hervás.",
};

export default function GalleryPage() {
  return (
    <LocaleProvider>
      <div className="flex flex-col min-h-screen">
        <BackNavbar />
        <main className="flex-1">
          <Gallery />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
