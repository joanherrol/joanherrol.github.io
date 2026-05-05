import { Button } from "@/components/ui/button";

export function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      className="flex-1 min-w-0 text-xs sm:text-sm"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {children}
      </a>
    </Button>
  );
}
