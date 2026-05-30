import { createFileRoute } from "@tanstack/react-router";
import { Phone, Hospital, ShieldAlert, Flame, Info } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EMERGENCY_SECTIONS, type SectionIconKey } from "@/lib/emergency-contacts";
import type { ContactCategory } from "@/lib/emergency-contacts";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Cameroon Emergency Contacts — Aceso AI Paramedic" },
      {
        name: "description",
        content:
          "Save these Cameroon emergency numbers — medical, police, fire, and more.",
      },
    ],
  }),
  component: EmergencyPage,
});

const BADGE_STYLES: Record<ContactCategory, string> = {
  Medical: "bg-red-50 text-red-600 border-red-100",
  Police: "bg-blue-50 text-blue-600 border-blue-100",
  Fire: "bg-orange-50 text-orange-600 border-orange-100",
  Other: "bg-gray-100 text-gray-600 border-gray-200",
};

const SECTION_ICON_STYLES: Record<ContactCategory, string> = {
  Medical: "bg-red-100 text-red-500",
  Police: "bg-blue-100 text-blue-500",
  Fire: "bg-orange-100 text-orange-500",
  Other: "bg-gray-100 text-gray-500",
};

const SECTION_ICONS: Record<SectionIconKey, React.FC<{ className?: string }>> = {
  "hospital": Hospital,
  "shield-alert": ShieldAlert,
  "flame": Flame,
  "info": Info,
};

import React from "react";

function EmergencyPage() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-dvh flex-col bg-[#FAFAFA] pb-20 md:pb-0 md:pl-60">
        {/* Hero Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#FF2D2D] to-[#C41E1E] px-4 py-14 text-white sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),_transparent_60%)]" />
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Phone className="h-3.5 w-3.5" /> Emergency Contacts
            </div>
            <h1 className="text-3xl font-bold sm:text-5xl">
              Cameroon Emergency Contacts
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/80">
              Save these numbers. Share them. They save lives.
            </p>
          </div>
        </header>

        {/* Sections */}
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
          {EMERGENCY_SECTIONS.map((section) => {
            const IconComponent = SECTION_ICONS[section.iconKey];
            const iconStyle = SECTION_ICON_STYLES[section.category];
            return (
              <section key={section.title} className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B7280]">
                    {section.title}
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.items.map((c) => (
                    <div
                      key={`${c.name}-${c.number}`}
                      className="flex flex-col gap-3 rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-black">{c.name}</p>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[c.category]}`}
                        >
                          {c.category}
                        </span>
                      </div>
                      <p className="text-xl font-bold tracking-tight text-red-500">{c.number}</p>
                      <a
                        href={`tel:${c.tel}`}
                        className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition active:scale-95 hover:bg-gray-800"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* CTA Banner */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-6 text-center text-white shadow-lg shadow-red-200">
            <p className="text-lg font-bold">In immediate danger?</p>
            <p className="mt-1 text-sm text-white/80">
              Call <strong>112</strong> now. Do not wait.
            </p>
            <a
              href="tel:112"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-red-600 shadow-md transition active:scale-95 hover:shadow-lg"
            >
              <Phone className="h-4 w-4" /> Call 112 Now
            </a>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
