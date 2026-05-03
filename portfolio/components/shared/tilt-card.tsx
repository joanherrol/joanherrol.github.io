"use client";

import Image from "next/image";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type TiltCardProps = {
  project: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
};

export function TiltCard({ project }: TiltCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInternal = project.url.startsWith("/");

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

  if (isInternal) {
    return (
      <Link
        ref={ref}
        href={project.url}
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
      </Link>
    );
  }

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
