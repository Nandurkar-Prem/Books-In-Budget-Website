import { useState, useCallback } from "react";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  /** Layout + object-fit + hover-scale Tailwind classes (no opacity/transition classes needed) */
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export default function BookCover({
  src,
  fallbackSrc,
  alt,
  className = "",
  loading = "lazy",
  priority = false,
}: BookCoverProps) {
  const [phase, setPhase] = useState<"primary" | "fallback" | "failed">("primary");
  const [loaded, setLoaded] = useState(false);

  const currentSrc =
    phase === "primary" ? src : phase === "fallback" ? (fallbackSrc ?? src) : "";

  const handleError = useCallback(() => {
    if (phase === "primary" && fallbackSrc) {
      setPhase("fallback");
      setLoaded(false);
    } else {
      setPhase("failed");
    }
  }, [phase, fallbackSrc]);

  const handleLoad = useCallback(() => setLoaded(true), []);

  if (phase === "failed") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-amber-50 to-orange-50 border border-orange-100 ${className}`}
        aria-label={alt}
      >
        <BookOpen size={28} className="text-primary/30" />
        <p className="text-[11px] text-center text-foreground/40 px-3 font-serif leading-snug line-clamp-4">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Skeleton — visible while image loads */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-stone-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        /*
         * Use inline style for opacity so it doesn't conflict with
         * transition-transform/duration set by the parent via className.
         * Tailwind transition-property classes override each other; inline
         * style merges cleanly with any CSS class transitions.
         */
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        className={className}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}
