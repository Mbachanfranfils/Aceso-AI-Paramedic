import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageSquare, Info, Siren } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const ITEMS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/chats", label: "Chats", Icon: MessageSquare },
  { to: "/about", label: "About", Icon: Info },
  { to: "/emergency", label: "Emergency", Icon: Siren },
] as const;

const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.07, type: "spring", stiffness: 260, damping: 22 },
  }),
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 },
  }),
};

export function Navigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 28, delay: 0.05 }}
        className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-white/95 backdrop-blur-sm md:flex"
        style={{ borderRight: "1px solid #F3F4F6", boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}
      >
        {/* Brand */}
        <div className="px-5 py-6">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 22 }}
          >
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md"
              style={{
                background: "linear-gradient(145deg, #FF4D4D 0%, #FF2D2D 60%, #C41E1E 100%)",
                boxShadow: "0 4px 12px rgba(255,45,45,0.35)",
              }}
              whileHover={{ scale: 1.12, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" fill="#fff" />
              </svg>
            </motion.div>
            <div>
              <p className="text-sm font-bold text-black">Aceso</p>
              <p className="text-[11px] text-[#9CA3AF]">AI Paramedic</p>
            </div>
          </motion.div>
        </div>

        <div className="mx-4 border-t border-[#F3F4F6]" />

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
          {ITEMS.map(({ to, label, Icon }, i) => {
            const active = pathname === to;
            return (
              <motion.div
                key={to}
                custom={i}
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={to}
                  className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all active:scale-95 ${
                    active
                      ? "bg-gradient-to-r from-red-50 to-red-50/50 font-semibold text-red-500"
                      : "text-[#374151] hover:bg-[#F9FAFB] hover:text-black"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-red-500"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: active ? 0 : -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Icon className={`h-4 w-4 transition-colors ${active ? "text-red-500" : "text-[#9CA3AF] group-hover:text-black"}`} />
                  </motion.div>
                  <span>{label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Emergency widget */}
        <motion.div
          className="p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 240, damping: 24 }}
        >
          <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-2.5">
            <p className="text-[11px] font-medium text-[#9CA3AF]">In an emergency?</p>
            <motion.a
              href="tel:112"
              className="mt-1 flex items-center gap-1.5 text-sm font-bold text-red-500 transition hover:text-red-600"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Siren className="h-3.5 w-3.5" /> Call 112 now
            </motion.a>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch bg-white/95 backdrop-blur-sm md:hidden"
        style={{ borderTop: "1px solid #F3F4F6", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        {ITEMS.map(({ to, label, Icon }, i) => {
          const active = pathname === to;
          return (
            <motion.div
              key={to}
              custom={i}
              variants={mobileItemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-1"
            >
              <Link
                to={to}
                className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
                  active ? "text-red-500" : "text-[#9CA3AF]"
                }`}
              >
                <motion.div
                  animate={active ? { scale: [1, 1.25, 1], y: [0, -4, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span>{label}</span>
                {active && (
                  <motion.span
                    layoutId="mobile-active-dot"
                    className="h-1 w-1 rounded-full bg-red-500"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </>
  );
}
