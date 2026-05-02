import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export default function BookCover({ src, alt, className = "", loading = "lazy" }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-amber-50 to-orange-100 dark:from-primary/20 dark:via-amber-950/30 dark:to-orange-950/20 ${className}`}
        aria-label={alt}
      >
        <BookOpen size={32} className="text-primary/40 mb-2" />
        <p className="text-xs text-center text-foreground/50 px-2 font-serif font-medium leading-tight line-clamp-3">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 bg-muted animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
