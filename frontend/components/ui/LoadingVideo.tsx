import React, { useRef, useEffect } from "react";

interface LoadingVideoProps {
  src: string;
  onPlayedOnce: () => void;
  className?: string;
}

export default function LoadingVideo({ src, onPlayedOnce, className }: LoadingVideoProps) {
  const playedOnceRef = useRef(false);

  const handleEnded = () => {
    console.log("Loading video ended once");
    if (!playedOnceRef.current) {
      playedOnceRef.current = true;
      onPlayedOnce();
    }
    // Video will loop automatically
  };

  useEffect(() => {
    playedOnceRef.current = false;
    console.log("Loading video mounted or src changed");
  }, [src]);

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      onEnded={handleEnded}
      className={className || "w-full h-full object-cover"}
      style={{ pointerEvents: "none" }}
    />
  );
}
