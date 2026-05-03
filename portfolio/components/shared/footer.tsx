import { Gamepad2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/icons";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Joan Hervás Roldán</p>
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/joanhervas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/joanherrol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://joan-hervas.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="itch.io"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Gamepad2 className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
