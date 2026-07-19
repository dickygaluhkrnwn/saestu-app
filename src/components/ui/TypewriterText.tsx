"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number; // Kecepatan mengetik dalam milidetik (ms)
  className?: string;
  onComplete?: () => void; // Fungsi yang dipanggil saat ngetik selesai
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 20, // 20ms per huruf (Cepat, natural, tidak bikin bosan)
  className = "",
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset state jika teks prop berubah
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      // Panggil onComplete HANYA sekali saat ngetik benar-benar selesai
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {/* Kursor berkedip ala ChatGPT saat masih mengetik */}
      {currentIndex < text.length && (
        <span className="inline-block w-1.5 h-[1em] bg-emerald-500 ml-1 animate-pulse align-middle rounded-sm" />
      )}
    </span>
  );
};