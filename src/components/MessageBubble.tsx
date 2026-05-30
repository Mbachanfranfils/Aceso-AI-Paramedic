import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Message } from "@/types";
import { messageSlideUp } from "@/animations/variants";
import { formatTime } from "@/lib/time";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <motion.div
      variants={messageSlideUp}
      initial="hidden"
      animate="visible"
      className={`group flex w-full flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-br-sm bg-black px-4 py-2.5 text-white transition hover:brightness-95"
            : "relative max-w-[80%] rounded-2xl rounded-bl-sm bg-[#F9FAFB] px-4 py-2.5 text-black transition hover:brightness-95"
        }
      >
        {isUser ? (
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {message.content.includes("[IMAGE_ATTACHMENT]") ? (
              <>
                <p>{message.content.replace("[IMAGE_ATTACHMENT]", "").trim()}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium text-white/90">
                  <span role="img" aria-label="image" className="opacity-80">📷</span> Image Attached
                </div>
              </>
            ) : (
              message.content
            )}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-[15px] leading-relaxed [&_p]:my-1 [&_ol]:my-1 [&_ul]:my-1 [&_li]:my-0.5">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy message"
            className="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#F3F4F6] bg-white text-[#9CA3AF] opacity-0 shadow-sm transition active:scale-95 hover:text-black group-hover:opacity-100"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
      <span className="mt-1 px-1 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
        {formatTime(message.timestamp)}
      </span>
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <motion.div
      variants={messageSlideUp}
      initial="hidden"
      animate="visible"
      className="flex w-full justify-start"
    >
      <div className="rounded-2xl rounded-bl-sm bg-[#F9FAFB] px-4 py-3">
        <div className="flex gap-1.5" aria-label="Assistant is typing">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 rounded-full bg-[#9CA3AF]"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
