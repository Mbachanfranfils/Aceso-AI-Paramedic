import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { HeartPulse, Shield, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aceso AI Paramedic" },
      {
        name: "description",
        content:
          "Why first aid matters, the limits of AI, and when to consult a healthcare professional.",
      },
    ],
  }),
  component: AboutPage,
});

const WHY_CARDS = [
  {
    Icon: HeartPulse,
    title: "Immediate Response",
    text: "The first few minutes after an emergency are critical. Knowing what to do can mean the difference between life and death.",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    Icon: Shield,
    title: "Prevent Worsening",
    text: "Correct first aid prevents injuries from becoming life-threatening while waiting for professional help.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    Icon: Users,
    title: "Community Strength",
    text: "Communities with first aid knowledge are more resilient, safer, and better equipped to protect each other.",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-dvh flex-col bg-[#FAFAFA] pb-20 md:pb-0 md:pl-60">

        {/* Hero */}
        <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,45,45,0.07),_transparent_60%)]" />
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-3xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-500"
            >
              <HeartPulse className="h-3.5 w-3.5" /> First Aid Awareness
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
              className="mt-3 text-4xl font-bold leading-tight tracking-tight text-black sm:text-6xl"
            >
              First Aid{" "}
              <motion.span
                className="text-red-500"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Saves Lives.
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mx-auto mt-6 max-w-xl text-base text-[#6B7280] sm:text-lg"
            >
              Understanding basic first aid is one of the most powerful things a
              person can do for their community.
            </motion.p>
          </motion.div>
        </section>

        {/* Why First Aid Matters */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center text-2xl font-bold text-black"
            >
              Why First Aid Matters
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid gap-6 md:grid-cols-3"
            >
              {WHY_CARDS.map(({ Icon, title, text, color, bg, border }) => (
                <motion.div
                  key={title}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 22 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl border ${border} bg-white p-6 shadow-sm cursor-pointer`}
                >
                  <motion.div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold text-black">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Limits */}
        <section className="px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center shadow-sm"
          >
            <h2 className="text-2xl font-bold text-black sm:text-3xl">
              AI Guidance Has Limits
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Aceso provides general first aid information only. It cannot
              assess your situation in real time, examine a patient, or replace
              the judgment of a trained medical professional.
            </p>
            <motion.p
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 text-base font-semibold text-red-600"
            >
              Always contact a healthcare professional for any medical concern —
              big or small.
            </motion.p>
          </motion.div>
        </section>

        {/* Speak to a Professional */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-center text-2xl font-bold text-black"
            >
              Speak to a Professional
            </motion.h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#6B7280]">
              For non-emergency medical advice, diagnosis, or ongoing health
              concerns, always consult a qualified healthcare provider.
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid gap-4 md:grid-cols-3"
            >
              {[
                { title: "General Practitioner", text: "Your first point of contact for most health concerns.", cta: false },
                { title: "Pharmacist", text: "Accessible medical guidance for minor conditions.", cta: false },
                { title: "Emergency Services", text: "Call immediately for life-threatening situations.", cta: true },
              ].map((c) => (
                <motion.div
                  key={c.title}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  className="flex flex-col rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-black">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6B7280]">{c.text}</p>
                  {c.cta && (
                    <Link
                      to="/emergency"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red-500 transition hover:text-red-600"
                    >
                      View Emergency Contacts →
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
