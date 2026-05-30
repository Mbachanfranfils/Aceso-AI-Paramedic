import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SESSION_STORAGE_KEY } from "@/lib/constants";

export function useSession(): { sessionId: string | null; ready: boolean } {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = async (): Promise<void> => {
      try {
        const existing = localStorage.getItem(SESSION_STORAGE_KEY);
        if (existing) {
          if (!cancelled) {
            setSessionId(existing);
            setReady(true);
          }
          return;
        }
        const { data, error } = await supabase
          .from("sessions")
          .insert({})
          .select("id")
          .single();
        if (error) throw error;
        localStorage.setItem(SESSION_STORAGE_KEY, data.id);
        if (!cancelled) {
          setSessionId(data.id);
          setReady(true);
        }
      } catch (err) {
        console.error("Failed to initialize session", err);
        if (!cancelled) setReady(true);
      }
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return { sessionId, ready };
}
