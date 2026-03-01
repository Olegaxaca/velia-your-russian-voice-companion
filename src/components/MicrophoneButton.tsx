import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MicrophoneButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  onClick: () => void;
}

const MicrophoneButton = ({ 
  isListening, 
  isSpeaking, 
  isConnecting, 
  isConnected,
  onClick 
}: MicrophoneButtonProps) => {
  const isActive = isListening || isSpeaking;

  return (
    // Добавляем pb-28, чтобы контент не перекрывался нижней панелью
    <div className="relative flex flex-col items-center justify-center pb-28">
      {/* Ripple effects when active */}
      <AnimatePresence>
        {isActive && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`absolute w-28 h-28 rounded-full border-2 ${
                  isSpeaking ? "border-accent/40" : "border-primary/40"
                }`}
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
          background: isSpeaking 
            ? "radial-gradient(circle, hsl(290 80% 65% / 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(270 80% 65% / 0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.6, 1, 0.6] : 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={isConnecting}
        className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50"
        style={{
          background: isConnected
            ? isSpeaking 
              ? "linear-gradient(135deg, hsl(290 80% 55%) 0%, hsl(310 70% 60%) 100%)"
              : "linear-gradient(135deg, hsl(270 80% 55%) 0%, hsl(290 70% 60%) 100%)"
            : "linear-gradient(135deg, hsl(270 80% 60%) 0%, hsl(290 70% 65%) 100%)",
          boxShadow: isActive
            ? isSpeaking
              ? "0 0 40px hsl(290 80% 65% / 0.6), 0 0 80px hsl(290 80% 65% / 0.3), inset 0 0 20px hsl(290 80% 70% / 0.3)"
              : "0 0 40px hsl(270 80% 65% / 0.6), 0 0 80px hsl(270 80% 65% / 0.3), inset 0 0 20px hsl(270 80% 70% / 0.3)"
            : "0 0 30px hsl(270 80% 65% / 0.4), 0 0 60px hsl(270 80% 65% / 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <motion.div initial={false} animate={{ rotate: 0 }}>
          {isConnecting ? (
            <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
          ) : isConnected ? (
            <Mic className="w-10 h-10 text-primary-foreground" />
          ) : (
            <MicOff className="w-10 h-10 text-primary-foreground/80" />
          )}
        </motion.div>
      </motion.button>

      {/* Status text */}
      <motion.p
        className="absolute bottom-16 text-sm font-medium text-muted-foreground text-center whitespace-nowrap"
        animate={{ opacity: isActive ? 1 : 0.7 }}
      >
        {isConnecting 
          ? "Подключение..." 
          : isConnected 
            ? isSpeaking 
              ? "Велия говорит..." 
              : isListening 
                ? "Слушаю..." 
                : "Готова слушать"
            : "Нажмите для начала"}
      </motion.p>
    </div>
  );
};

export default MicrophoneButton;
