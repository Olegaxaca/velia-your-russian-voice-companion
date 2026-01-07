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
      {/* Outer glow rings */}
      <motion.div
        className="absolute w-44 h-44 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(280 80% 55% / 0.15) 0%, hsl(200 90% 60% / 0.1) 40%, transparent 70%)",
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.3,
        }}
        transition={{
          duration: 2.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary glow */}
      <motion.div
        className="absolute w-36 h-36 rounded-full"
        style={{
          background: isSpeaking 
            ? "radial-gradient(circle, hsl(180 90% 50% / 0.25) 0%, hsl(280 80% 50% / 0.15) 50%, transparent 70%)"
            : "radial-gradient(circle, hsl(200 85% 55% / 0.2) 0%, hsl(280 75% 50% / 0.12) 50%, transparent 70%)",
        }}
        animate={{
          scale: isActive ? [1, 1.15, 1] : 1,
          opacity: isActive ? [0.5, 0.9, 0.5] : 0.4,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Main orb - Velia logo shape */}
      <motion.button
        onClick={onClick}
        disabled={isConnecting}
        className="relative z-10 w-28 h-28 flex items-center justify-center transition-all duration-300 disabled:opacity-50 overflow-hidden"
        style={{
          background: isConnected
            ? isSpeaking
              ? "linear-gradient(160deg, hsl(200 95% 55%) 0%, hsl(180 90% 45%) 25%, hsl(260 80% 50%) 50%, hsl(280 75% 45%) 75%, hsl(200 90% 50%) 100%)"
              : "linear-gradient(160deg, hsl(210 90% 50%) 0%, hsl(190 85% 45%) 25%, hsl(270 75% 48%) 50%, hsl(285 70% 42%) 75%, hsl(210 85% 48%) 100%)"
            : "linear-gradient(160deg, hsl(215 70% 40%) 0%, hsl(200 65% 38%) 25%, hsl(270 55% 40%) 50%, hsl(280 50% 35%) 75%, hsl(210 60% 38%) 100%)",
          boxShadow: isActive
            ? `0 0 40px hsl(180 90% 55% / 0.6), 
               0 0 80px hsl(280 80% 50% / 0.4), 
               0 0 120px hsl(200 90% 55% / 0.25),
               inset 0 0 30px hsl(180 85% 65% / 0.3),
               inset 0 -20px 40px hsl(280 70% 45% / 0.4)`
            : `0 0 25px hsl(200 80% 50% / 0.35), 
               0 0 50px hsl(280 70% 45% / 0.2),
               inset 0 0 20px hsl(180 75% 55% / 0.15),
               inset 0 -15px 30px hsl(270 60% 40% / 0.25)`,
          borderRadius: "42% 58% 45% 55% / 55% 45% 55% 45%",
          border: "1px solid hsl(200 80% 60% / 0.15)",
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: isActive ? [1, 1.04, 1] : 1,
          borderRadius: isActive 
            ? [
                "42% 58% 45% 55% / 55% 45% 55% 45%", 
                "48% 52% 50% 50% / 50% 50% 50% 50%", 
                "42% 58% 45% 55% / 55% 45% 55% 45%"
              ] 
            : "42% 58% 45% 55% / 55% 45% 55% 45%",
        }}
        transition={{
          duration: 2.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Glass highlight overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.05) 100%)",
            borderRadius: "inherit",
          }}
        />
        
        {/* Inner highlight */}
        <div 
          className="absolute top-2 left-3 w-6 h-4 opacity-40"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(3px)",
          }}
        />

        {/* Wave line - animated audio wave */}
        <svg 
          className="absolute w-16 h-16" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="veliaWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(180 95% 70%)" />
              <stop offset="30%" stopColor="hsl(190 90% 75%)" />
              <stop offset="70%" stopColor="hsl(200 90% 80%)" />
              <stop offset="100%" stopColor="hsl(180 95% 70%)" />
            </linearGradient>
          </defs>
          <motion.path
            fill="none"
            stroke="url(#veliaWaveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{
              d: isActive
                ? [
                    "M 15 50 Q 30 30, 50 50 T 85 50",
                    "M 15 50 Q 30 70, 50 50 T 85 50",
                    "M 15 50 Q 30 30, 50 50 T 85 50",
                  ]
                : "M 15 50 Q 30 48, 50 50 T 85 50",
              opacity: isActive ? [0.9, 1, 0.9] : 0.7,
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
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
              <Loader2 className="w-8 h-8 text-white/90 animate-spin" />
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
