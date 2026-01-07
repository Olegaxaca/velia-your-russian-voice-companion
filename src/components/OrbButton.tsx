import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface OrbButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  onClick: () => void;
}

const OrbButton = ({ 
  isListening, 
  isSpeaking, 
  isConnecting, 
  isConnected,
  onClick 
}: OrbButtonProps) => {
  const isActive = isListening || isSpeaking;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: isSpeaking 
            ? "radial-gradient(circle, hsl(200 90% 60% / 0.3) 0%, hsl(280 80% 60% / 0.2) 50%, transparent 70%)"
            : "radial-gradient(circle, hsl(200 80% 55% / 0.3) 0%, hsl(260 70% 55% / 0.2) 50%, transparent 70%)",
        }}
        animate={{
          scale: isActive ? [1, 1.3, 1] : 1,
          opacity: isActive ? [0.5, 0.8, 0.5] : 0.4,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Main orb */}
      <motion.button
        onClick={onClick}
        disabled={isConnecting}
        className="relative z-10 w-28 h-28 rounded-[40%] flex items-center justify-center transition-all duration-300 disabled:opacity-50 overflow-hidden"
        style={{
          background: isConnected
            ? isSpeaking
              ? "linear-gradient(180deg, hsl(200 85% 50% / 0.6) 0%, hsl(280 70% 50% / 0.8) 50%, hsl(200 80% 45% / 0.6) 100%)"
              : "linear-gradient(180deg, hsl(220 80% 55% / 0.6) 0%, hsl(270 65% 50% / 0.8) 50%, hsl(200 75% 50% / 0.6) 100%)"
            : "linear-gradient(180deg, hsl(220 70% 45% / 0.5) 0%, hsl(260 60% 45% / 0.7) 50%, hsl(200 65% 40% / 0.5) 100%)",
          boxShadow: isActive
            ? `0 0 60px hsl(200 80% 60% / 0.5), 
               0 0 100px hsl(280 70% 55% / 0.3), 
               inset 0 0 40px hsl(200 80% 70% / 0.3),
               inset 0 -20px 40px hsl(280 70% 50% / 0.4)`
            : `0 0 40px hsl(220 70% 55% / 0.3), 
               0 0 70px hsl(260 60% 50% / 0.2),
               inset 0 0 30px hsl(200 70% 60% / 0.2),
               inset 0 -15px 30px hsl(260 60% 45% / 0.3)`,
          borderRadius: "45% 55% 50% 50%",
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: isActive ? [1, 1.03, 1] : 1,
          borderRadius: isActive 
            ? ["45% 55% 50% 50%", "50% 50% 55% 45%", "45% 55% 50% 50%"] 
            : "45% 55% 50% 50%",
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Glass overlay */}
        <div 
          className="absolute inset-0 rounded-inherit"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        {/* Wave line - animated */}
        <svg 
          className="absolute w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <motion.path
            d={isActive 
              ? "M 10 50 Q 25 30, 40 50 T 70 50 T 90 50" 
              : "M 10 50 Q 25 45, 40 50 T 70 50 T 90 50"}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              d: isActive
                ? [
                    "M 10 50 Q 25 25, 40 50 T 70 50 T 90 50",
                    "M 10 50 Q 25 50, 40 35 T 70 55 T 90 50",
                    "M 10 50 Q 25 55, 40 50 T 70 35 T 90 50",
                    "M 10 50 Q 25 25, 40 50 T 70 50 T 90 50",
                  ]
                : "M 10 50 Q 25 45, 40 50 T 70 50 T 90 50",
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(200 90% 70%)" />
              <stop offset="50%" stopColor="hsl(180 85% 75%)" />
              <stop offset="100%" stopColor="hsl(200 90% 70%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Loading indicator */}
        <AnimatePresence>
          {isConnecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute"
            >
              <Loader2 className="w-8 h-8 text-white/80 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status text */}
      <motion.p
        className="absolute -bottom-12 text-sm font-medium text-muted-foreground text-center whitespace-nowrap"
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

export default OrbButton;
