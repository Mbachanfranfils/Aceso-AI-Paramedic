import { Link } from "@tanstack/react-router";
import { Heart, ShieldAlert, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#F3F4F6] bg-gradient-to-b from-white to-[#FDF8F8]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Top row */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 shadow-md shadow-red-200">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" fill="#fff" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Aceso</p>
              <p className="text-[11px] text-[#9CA3AF]">AI Paramedic</p>
            </div>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
            <Link to="/about" className="transition-colors hover:text-red-500">About</Link>
            <Link to="/chats" className="transition-colors hover:text-red-500">Chats</Link>
            <Link to="/emergency" className="transition-colors hover:text-red-500">Emergency</Link>
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/60 p-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs leading-relaxed text-[#6B2A2A]">
            <strong>Medical Disclaimer:</strong> Aceso is not a licensed medical device and does not
            provide diagnosis or treatment. In an emergency, always call{" "}
            <a href="tel:112" className="font-semibold underline underline-offset-2 hover:text-red-600">
              112
            </a>{" "}
            immediately. The guidance provided is for informational purposes only and must not
            replace professional medical care.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#F3F4F6] pt-4 sm:flex-row">
          <p className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            Built with <Heart className="h-3 w-3 fill-red-400 text-red-400" /> for community safety
          </p>
          <p className="text-xs text-[#9CA3AF]">
            © {new Date().getFullYear()} Aceso · AI Paramedic
          </p>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-200 transition hover:bg-red-600 active:scale-95"
          >
            <Phone className="h-3 w-3" /> Call 112
          </a>
        </div>
      </div>
    </footer>
  );
}
