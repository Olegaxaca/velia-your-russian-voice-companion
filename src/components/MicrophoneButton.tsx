import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MicrophoneButtonProps {
  onToggle?: (isListening: boolean) => void;
}

const MicrophoneButton = ({ onToggle }: MicrophoneButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    const newState = !isListening;
    setIsListening(newState);
    onToggle?.(newState);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple effects when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-28 h-28 rounded-full border-2 border-primary/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Glow effect */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(270 80% 65% / 0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: isListening ? [1, 1.2, 1] : 1,
          opacity: isListening ? [0.6, 1, 0.6] : 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Main button */}
      <motion.button
        onClick={handleClick}
        className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: isListening
            ? "linear-gradient(135deg, hsl(270 80% 55%) 0%, hsl(290 70% 60%) 100%)"
            : "linear-gradient(135deg, hsl(270 80% 60%) 0%, hsl(290 70% 65%) 100%)",
          boxShadow: isListening
            ? "0 0 40px hsl(270 80% 65% / 0.6), 0 0 80px hsl(270 80% 65% / 0.3), inset 0 0 20px hsl(270 80% 70% / 0.3)"
            : "0 0 30px hsl(270 80% 65% / 0.4), 0 0 60px hsl(270 80% 65% / 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: isListening ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isListening ? 0 : 0 }}
        >
          {isListening ? (
            <Mic className="w-10 h-10 text-primary-foreground" />
          ) : (
            <MicOff className="w-10 h-10 text-primary-foreground/80" />
          )}
        </motion.div>
      </motion.button>

      {/* Status text */}
      <motion.p
        className="absolute -bottom-12 text-sm font-medium text-muted-foreground"
        animate={{ opacity: isListening ? 1 : 0.7 }}
      >
        {isListening ? "Слушаю..." : "Нажмите для записи"}
      </motion.p>
    </div>
  );
};

export default MicrophoneButton;
