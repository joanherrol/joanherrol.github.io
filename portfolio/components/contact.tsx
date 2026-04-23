"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const contactMeta = [
  {
    icon: MapPin,
    value: "Santa Coloma de Gramenet, Barcelona",
    href: null as string | null,
  },
  { icon: Phone, value: "+34 635 29 57 31", href: "tel:+34635295731" },
  {
    icon: Mail,
    value: "joanherrol@gmail.com",
    href: "mailto:joanherrol@gmail.com",
  },
];

export function Contact() {
  const { t } = useLocale();

  const contactItems = [
    { ...contactMeta[0], label: t.contact.locationLabel },
    { ...contactMeta[1], label: t.contact.phoneLabel },
    { ...contactMeta[2], label: t.contact.emailLabel },
  ];

  return (
    <section id="contact" className="min-h-screen flex flex-col bg-muted/30">
      <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-16">
          {t.contact.label}
        </p>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactItems.map(({ icon: Icon, label, value, href }) => {
              const card = (
                <div className="group flex flex-col gap-4 rounded-xl border border-border bg-background/60 backdrop-blur-sm p-6 transition-all duration-200 hover:border-foreground/20 hover:-translate-y-1 hover:shadow-lg">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-medium mt-1">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href}>
                  {card}
                </a>
              ) : (
                <div key={label}>{card}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
