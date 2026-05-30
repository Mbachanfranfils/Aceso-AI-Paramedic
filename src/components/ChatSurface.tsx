import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send, ArrowDown, TriangleAlert, Camera, X } from "lucide-react";
import { MessageBubble, TypingBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import { Navigation } from "./Navigation";
import { useChat } from "@/hooks/useChat";
import {
  APP_NAME,
  APP_TAGLINE,
  DISCLAIMER,
  EMERGENCY_BANNER,
  INPUT_PLACEHOLDER,
  MAX_INPUT_LENGTH,
} from "@/lib/constants";

interface ChatSurfaceProps {
  sessionId: string | null;
}

export function ChatSurface({ sessionId }: ChatSurfaceProps) {
  const { messages, isLoading, error, isEmergency, send } = useChat(sessionId);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollDown(distance > 120);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = sendBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    span.className = "ripple-span";
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const MAX_WIDTH = 800;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as JPEG 0.6
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setImagePreview(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const text = input.trim();
    if (!text && !imagePreview) {
      triggerShake();
      return;
    }
    
    const imageToSend = imagePreview;
    setInput("");
    setImagePreview(null);
    await send(text, imageToSend || undefined);
  };

  const handleChip = async (chip: string): Promise<void> => {
    if (isLoading) return;
    await send(chip);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <motion.div
        layoutId="first-aid-box"
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed inset-0 z-10 flex flex-col bg-[#FAFAFA] pb-16 md:pb-0 md:pl-60"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <header className="flex flex-col gap-1.5 border-b border-[#F3F4F6] bg-white/95 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-black">{APP_NAME}</h1>
            <p className="text-xs text-[#9CA3AF]">{APP_TAGLINE}</p>
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
            <TriangleAlert className="h-3 w-3" />
            {DISCLAIMER}
          </p>
        </header>

        {/* Emergency banner */}
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 border-b border-[#FECACA] bg-gradient-to-r from-[#FEF2F2] to-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#DC2626] sm:px-6"
            role="alert"
          >
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {EMERGENCY_BANNER}
          </motion.div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto scroll-smooth px-4 py-6 sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-6 py-8">
                <div>
                  <p className="text-base font-semibold text-black">
                    What's the situation?
                  </p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Tap a common scenario or describe the emergency below.
                  </p>
                </div>
                <PromptChips onSelect={handleChip} disabled={isLoading} />
              </div>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && <TypingBubble />}
            {error && (
              <div className="self-start rounded-2xl rounded-bl-sm border border-red-100 bg-[#FEF2F2] px-4 py-2.5 text-sm text-[#DC2626]">
                {error}
              </div>
            )}
          </div>

          <AnimatePresence>
            {showScrollDown && (
              <motion.button
                key="scroll-down"
                type="button"
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="sticky bottom-4 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#F3F4F6] bg-white text-black shadow-md transition hover:shadow-lg active:scale-95"
              >
                <ArrowDown className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Input — glassmorphic */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#F3F4F6] bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-1">
            {/* Image Preview Area */}
            {imagePreview && (
              <div className="relative mb-2 self-start rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-sm">
                <img src={imagePreview} alt="Upload preview" className="h-20 w-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#9CA3AF] shadow-sm transition hover:text-black"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className={`flex items-end gap-2 ${shake ? "animate-shake" : ""}`}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !sessionId}
                aria-label="Upload image"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                placeholder={INPUT_PLACEHOLDER}
                disabled={isLoading || !sessionId}
                maxLength={MAX_INPUT_LENGTH}
                aria-label="Describe the emergency"
                className="flex-1 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3 text-[15px] text-black placeholder:text-[#9CA3AF] transition-all focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-60"
              />
              <button
                ref={sendBtnRef}
                type="submit"
                onClick={addRipple}
                disabled={isLoading || !sessionId}
                aria-label="Send message"
                className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: "linear-gradient(145deg, #FF4D4D 0%, #FF2D2D 60%, #C41E1E 100%)",
                  boxShadow: "0 4px 14px rgba(255,45,45,0.4)",
                }}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="px-2 text-right text-xs text-gray-400">
              {input.length}/{MAX_INPUT_LENGTH}
            </div>
          </div>
        </form>
      </motion.div>
      <Navigation />
    </>
  );
}
