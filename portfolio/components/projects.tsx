"use client";

import Image from "next/image";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const projectMeta = [
  { image: "/imgs/Proovit.png", url: "https://proovitapp.com" },
  {
    image: "/imgs/ShootEmUp.png",
    url: "https://joan-hervas.itch.io/shootemup",
  },
  {
    image: "/imgs/PugAdventure.png",
    url: "https://joan-hervas.itch.io/pug-adventure",
  },
];

type ProjectItem = {
  title: string;
  description: string;
  image: string;
  url: string;
};

function TiltCard({ project }: { project: ProjectItem }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / rect.height) * -16;
    const rotY = ((x - rect.width / 2) / rect.width) * 16;
    el.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden border-border gap-0 py-0">
        <div className="relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, 33vw"
            loading="eager"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
            <ExternalLink className="h-4 w-4 self-end" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border">
          <p className="text-sm font-semibold">{project.title}</p>
        </div>
      </Card>
    </a>
  );
}

export function Projects() {
  const { t } = useLocale();
  const projects = t.projects.items.map((item, i) => ({
    ...item,
    ...projectMeta[i],
  }));

  return (
    <section id="projects" className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-16">
          {t.projects.label}
        </p>
        <p className="text-base max-w-2xl mb-16">
          {t.projects.intro}{" "}
          <a
            href="https://github.com/joanherrol"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {t.projects.githubLabel}
          </a>
          .
        </p>
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {projects.map((p) => (
              <TiltCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
