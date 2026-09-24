"use client";

import { useEffect, useRef } from "react";

const DIM = 0.14;

// Words light up one after another as the paragraph scrolls through the viewport.
export function LitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const spans = Array.from(element.querySelectorAll<HTMLSpanElement>("[data-word]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((span) => (span.style.opacity = "1"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.45;
      const progress = Math.min(Math.max((start - rect.top) / (rect.height + start - end), 0), 1);
      const lit = progress * spans.length;
      spans.forEach((span, i) => {
        span.style.opacity = String(DIM + (1 - DIM) * Math.min(Math.max(lit - i, 0), 1));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} data-word style={{ opacity: DIM }} className="transition-opacity duration-300">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
