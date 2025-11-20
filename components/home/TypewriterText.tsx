"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Cortes Premium",
  "Carne Selecta",
  "Calidad Superior",
  "Sabor Auténtico",
  "Directo a tu Mesa"
];

export default function TypewriterText() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < phrase.length) {
          setCurrentText(phrase.substring(0, currentText.length + 1));
          setSpeed(100);
        } else {
          // Pause at end
          setSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(phrase.substring(0, currentText.length - 1));
          setSpeed(50);
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
          setSpeed(500);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, speed]);

  return (
    <span className="inline-block min-w-[300px] sm:min-w-[400px] text-left">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
