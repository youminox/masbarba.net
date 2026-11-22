"use client";

import { useEffect, useState } from "react";
import { openChat } from "@/lib/chat-constants";

/**
 * Efectos globales de página: [data-reveal] y .split al entrar en pantalla, spotlight de tarjetas,
 * botones magnéticos [data-magnetic] y barra flotante en móvil (tras 700 px).
 */
export default function ClientEffects({ stickyBar = true }: { stickyBar?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    const scan = () =>
      document
        .querySelectorAll(
          "[data-reveal]:not(.is-in), .split:not(.is-in), .gel-scene:not(.is-in)"
        )
        .forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const t = target?.closest?.(".spot") as HTMLElement | null;
      if (t) {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (!fine) return;
      const m = target?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (magnet && magnet !== m) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
        magnet = m;
      }
    };

    const onLeave = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };

    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!stickyBar) return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 md:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/25 bg-[#021a19]/95 p-2.5 pl-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="leading-tight">
          <p className="text-[0.68rem] uppercase tracking-wider text-emerald-300/80">
            MásBarba.net · You Minox 5%
          </p>
          <p className="font-display text-sm font-extrabold">
            +2,463 Guías ·{" "}
            <span className="text-xs font-semibold text-amber-300">
              Cero Caspa & DIGEMID
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => openChat()}
          className="btn btn-lime shine !px-4 !py-2.5 text-xs cursor-pointer"
        >
          🧔 Asesor IA
        </button>
      </div>
    </div>
  );
}
