import { useState, useEffect } from "react";

export type ActivationStyle = "microphone" | "orb";

const STORAGE_KEY = "velia_activation_style";

export const useActivationStyle = () => {
  const [style, setStyle] = useState<ActivationStyle>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as ActivationStyle) || "microphone";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, style);
  }, [style]);

  return { style, setStyle };
};
