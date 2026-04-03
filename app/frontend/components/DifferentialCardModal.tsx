"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DifferentialItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  colorHsl: string;
  sovereign: string;
  generic: string;
  /** Rich details shown only inside the modal */
  detail: {
    headline: string;
    points: string[];
    cta?: string;
  };
}

interface DifferentialCardModalProps {
  item: DifferentialItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** Framer-motion stagger variant passed by parent */
  animVariants?: Variants;
}

// ─── Animation config ─────────────────────────────────────────────────────────

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.18,
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94] as Transition["ease"],
    } as Transition,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 } as Transition,
  },
};

/** Spring used for the shared-layout transition */
function makeLayoutTransition(reduced: boolean | null): Transition {
  if (reduced) return { duration: 0 };
  return {
    type: "spring" as const,
    stiffness: 280,
    damping: 30,
    mass: 0.8,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DifferentialCardModal({
  item,
  isOpen,
  onOpen,
  onClose,
  animVariants,
}: DifferentialCardModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus to close button when modal opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const layoutTransition = makeLayoutTransition(shouldReduceMotion);

  return (
    <>
      {/* ── Card shell (shared between card and expanded modal) ── */}
      <motion.div
        variants={animVariants}
        layoutId={`differential-card-${item.id}`}
        layout
        style={{ originX: 0.5, originY: 0.5 }}
        transition={layoutTransition}
        onClick={!isOpen ? onOpen : undefined}
        onKeyDown={(e) => {
          if (!isOpen && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpen();
          }
        }}
        role={!isOpen ? "button" : "dialog"}
        aria-modal={isOpen ? true : undefined}
        aria-label={!isOpen ? `Ver detalhes: ${item.title}` : item.title}
        tabIndex={!isOpen ? 0 : undefined}
        aria-haspopup={!isOpen ? "dialog" : undefined}
        className={[
          "group relative rounded-2xl border overflow-hidden",
          "transition-[border-color,box-shadow] duration-500",
          !isOpen
            ? [
                "bg-surface-card border-white/5 cursor-pointer",
                "hover:border-white/15 hover:shadow-[0_0_2rem_rgba(51,255,0,0.06)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2",
              ].join(" ")
            : [
                "fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
                "z-[9999] bg-surface-card border-white/10",
                "w-full md:w-[42rem] md:max-w-[92vw]",
                "max-h-[100dvh] md:max-h-[88dvh] overflow-y-auto custom-scrollbar",
                "shadow-[0_0_4rem_rgba(51,255,0,0.12)]",
              ].join(" "),
        ].join(" ")}
      >
        {/* Accent bar */}
        <motion.div
          layoutId={`differential-accent-${item.id}`}
          transition={layoutTransition}
          className="w-full"
          style={{
            backgroundColor: item.colorHsl,
            height: isOpen ? "0.1875rem" : "0.125rem",
          }}
        />

        <div className={isOpen ? "p-8 md:p-10" : "p-6 md:p-8"}>
          {/* Shared header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              layoutId={`differential-icon-${item.id}`}
              transition={layoutTransition}
              className="p-2.5 rounded-xl flex-shrink-0"
              style={{
                backgroundColor: `color-mix(in srgb, ${item.colorHsl} 12%, transparent)`,
                color: item.colorHsl,
              }}
            >
              {item.icon}
            </motion.div>

            <motion.h3
              layoutId={`differential-title-${item.id}`}
              transition={layoutTransition}
              className="font-bold text-white text-lg tracking-tight flex-1"
            >
              {item.title}
            </motion.h3>

            {/* Close button — only inside modal */}
            {isOpen && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Fechar modal"
                className={[
                  "ml-auto p-1.5 rounded-lg text-zinc-400",
                  "hover:text-white hover:bg-white/10 transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30",
                ].join(" ")}
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Comparison strips (always visible) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sovereign AI */}
            <div
              className="rounded-xl p-4 border transition-all duration-300"
              style={{
                backgroundColor: `color-mix(in srgb, ${item.colorHsl} 5%, transparent)`,
                borderColor: `color-mix(in srgb, ${item.colorHsl} 18%, transparent)`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.colorHsl }}
                />
                <span
                  className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
                  style={{ color: item.colorHsl }}
                >
                  Sovereign AI
                </span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                {item.sovereign}
              </p>
            </div>

            {/* Generic AI */}
            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Pesquisa Comum
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {item.generic}
              </p>
            </div>
          </div>

          {/* Modal-only expanded content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="detail"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8 space-y-6"
                onKeyDown={handleKeyDown}
              >
                {/* Gradient divider */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(to right, color-mix(in srgb, ${item.colorHsl} 30%, transparent), transparent)`,
                  }}
                />

                <h4
                  className="text-base font-semibold leading-snug"
                  style={{ color: item.colorHsl }}
                >
                  {item.detail.headline}
                </h4>

                <ul className="space-y-3" role="list">
                  {item.detail.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed"
                    >
                      <span
                        className="mt-[0.3rem] w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.colorHsl }}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                {item.detail.cta && (
                  <blockquote
                    className="rounded-xl p-4 text-sm font-medium leading-relaxed"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${item.colorHsl} 8%, transparent)`,
                      borderLeft: `0.1875rem solid ${item.colorHsl}`,
                      color: item.colorHsl,
                    }}
                  >
                    {item.detail.cta}
                  </blockquote>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card-only: click affordance */}
          {!isOpen && (
            <p
              className="mt-4 text-[0.65rem] text-zinc-600 tracking-wide flex items-center gap-1.5"
              aria-hidden="true"
            >
              <span
                className="inline-block w-1 h-1 rounded-full opacity-60"
                style={{ backgroundColor: item.colorHsl }}
              />
              Clique para ver mais detalhes
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`backdrop-${item.id}`}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 } as Transition}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}
