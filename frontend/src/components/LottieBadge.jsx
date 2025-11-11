import React, { useEffect, useRef, useState } from "react";

/**
 * Small helper that lazily loads lottie-react if available.
 * Falls back to a pulsing dot if the package isn't installed.
 */
export default function LottieBadge({ src, className = "" }) {
  const containerRef = useRef(null);
  const [LottieComp, setLottieComp] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function mount() {
      try {
        const mod = await import("lottie-react");
        if (!cancelled) {
          setLottieComp(() => mod.default);
        }
      } catch {
        // ignore
      }
    }
    mount();
    return () => {
      cancelled = true;
    };
  }, []);

  if (LottieComp) {
    const Lottie = LottieComp;
    return <Lottie animationData={src} loop className={className} />;
  }

  // Fallback: subtle pulsing badge
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300 opacity-40" />
      <span className="absolute inset-2 rounded-full bg-emerald-500 opacity-70" />
    </div>
  );
}

