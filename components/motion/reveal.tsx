"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  as?: "div" | "li";
  delay?: 0 | 1 | 2 | 3 | 4;
  instant?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  instant = false,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLLIElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setVisible(true);
      setSettled(true);
      return;
    }

    if (instant) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    const fallback = window.setTimeout(() => setVisible(true), 1400);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [instant]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        !settled && "reveal",
        visible && !settled && "reveal-visible",
        delay > 0 && !settled && `reveal-delay-${delay}`,
        className
      )}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        if (event.animationName !== "reveal-up") {
          return;
        }

        setSettled(true);
      }}
    >
      {children}
    </Tag>
  );
}
