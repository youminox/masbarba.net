"use client";

import { openChat } from "@/lib/chat-constants";

export default function OpenChatButton({
  label = "Consultar al Asesor IA Folicular",
  prompt,
  className = "btn btn-buy",
  magnetic = false,
}: {
  label?: string;
  prompt?: string;
  className?: string;
  magnetic?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => openChat(prompt)}
      data-magnetic={magnetic ? "" : undefined}
      className={`${className} cursor-pointer`}
    >
      {label}
    </button>
  );
}
