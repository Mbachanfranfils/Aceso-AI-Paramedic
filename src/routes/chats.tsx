import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { formatRelative } from "@/lib/time";
import { MessageSquare, AlertTriangle, Clock } from "lucide-react";

interface SessionPreview {
  id: string;
  preview: string;
  last_active: string;
  is_emergency: boolean;
}

export const Route = createFileRoute("/chats")({
  head: () => ({
    meta: [
      { title: "Previous Chats — Aceso AI Paramedic" },
      { name: "description", content: "Your previous first aid chat sessions." },
    ],
  }),
  component: ChatsPage,
});

function ChatsPage() {
  const [sessions, setSessions] = useState<SessionPreview[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("session_id, role, content, is_emergency, created_at")
        .order("created_at", { ascending: true })
        .limit(2000);

      if (!msgs) {
        setSessions([]);
        return;
      }

      const map = new Map<string, SessionPreview>();
      for (const m of msgs) {
        const existing = map.get(m.session_id);
        if (!existing) {
          map.set(m.session_id, {
            id: m.session_id,
            preview: m.role === "user" ? m.content : "",
            last_active: m.created_at,
            is_emergency: m.is_emergency,
          });
        } else {
          if (!existing.preview && m.role === "user") existing.preview = m.content;
          existing.last_active = m.created_at;
          if (m.is_emergency) existing.is_emergency = true;
        }
      }
      const list = Array.from(map.values())
        .filter((s) => s.preview)
        .sort((a, b) => +new Date(b.last_active) - +new Date(a.last_active))
        .slice(0, 50);
      setSessions(list);
    };
    void load();
  }, []);

  return (
    <>
      <Navigation />
      <main className="flex min-h-dvh flex-col bg-[#FAFAFA] pb-20 md:pb-0 md:pl-60">
        {/* Header */}
        <div className="border-b border-[#F3F4F6] bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <MessageSquare className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Previous Chats</h1>
                <p className="text-sm text-[#9CA3AF]">Your past first aid conversations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl flex flex-col gap-3">
            {/* Skeleton */}
            {sessions === null && (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl bg-[#F3F4F6]"
                  />
                ))}
              </>
            )}

            {/* Empty state */}
            {sessions && sessions.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F4F6]">
                  <MessageSquare className="h-8 w-8 text-[#D1D5DB]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-black">No previous chats yet.</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Start a conversation to get first aid guidance.
                  </p>
                </div>
                <Link
                  to="/"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition active:scale-95 hover:bg-red-600"
                >
                  Start a chat
                </Link>
              </div>
            )}

            {/* Session list */}
            {sessions?.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link
                  to="/"
                  className="group block rounded-2xl border border-[#F3F4F6] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.is_emergency ? "bg-red-50" : "bg-[#F3F4F6]"}`}>
                        {s.is_emergency
                          ? <AlertTriangle className="h-4 w-4 text-red-500" />
                          : <MessageSquare className="h-4 w-4 text-[#9CA3AF]" />
                        }
                      </div>
                      <p className="line-clamp-1 text-sm font-medium text-black">
                        {s.preview.slice(0, 80)}{s.preview.length > 80 ? "…" : ""}
                      </p>
                    </div>
                    {s.is_emergency && (
                      <span className="shrink-0 rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                        Emergency
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 pl-11 text-xs text-[#9CA3AF]">
                    <Clock className="h-3 w-3" />
                    {formatRelative(s.last_active)}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
