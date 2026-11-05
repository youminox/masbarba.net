"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/data";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  layout?: string;
  className?: string;
}

export default function AdBanner({
  slot = "auto",
  format = "auto",
  layout,
  className = "",
}: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch {
      // AdSense script may be blocked by adblocker in dev
    }
  }, []);

  return (
    <div
      className={`overflow-hidden rounded-xl bg-slate-50/70 text-center ${className}`}
      aria-label="Publicidad"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        {...(slot !== "auto" ? { "data-ad-slot": slot } : {})}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
