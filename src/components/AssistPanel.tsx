import { useState, useEffect, useRef } from "react";
import { Plus, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

const MiniVisualizer = ({ isActive }: { isActive: boolean }) => {
  const barCount = 5;
  return (
    <div className="flex items-center gap-[3px] h-6">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[#D5A3FF]"
          animate={
            isActive
              ? {
                  height: [6, 18, 8, 22, 6],
                }
              : { height: 6 }
          }
          transition={
            isActive
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

interface AssistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistPanel = ({ isOpen, onClose }: AssistPanelProps) => {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    connect,
    disconnect,
  } = useRealtimeChat();

  const isActive = isListening || isSpeaking || isConnected;

  // Auto-connect on open
  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      connect();
    }
    if (!isOpen && isConnected) {
      disconnect();
    }
  }, [isOpen]);

  const handleMicClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Translucent backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel container - anchored to bottom center */}
          <motion.div
            className="fixed bottom-6 left-1/2 z-[101]"
            initial={{ opacity: 0, y: 80, x: "-50%", scale: 0.6 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 80, x: "-50%", scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {/* Pulsating glow when active */}
            {isActive && (
              <motion.div
                className="absolute -inset-2 rounded-[2rem] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(270 80% 65% / 0.25) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Main panel */}
            <div
              className="relative flex items-center gap-3 px-4 py-3 rounded-[1.75rem]"
              style={{
                background: "hsl(270 25% 12% / 0.85)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid hsl(270 20% 22% / 0.6)",
                boxShadow:
                  "0 8px 32px hsl(270 40% 8% / 0.6), 0 0 0 1px hsl(270 20% 20% / 0.3)",
                minWidth: 320,
              }}
            >
              {/* + button */}
              <button
                className="flex-shrink-0 p-1 transition-colors hover:opacity-80"
                style={{ color: "#D5A3FF" }}
              >
                <Plus className="w-6 h-6" />
              </button>

              {/* Hint text */}
              <span
                className="flex-1 text-base select-none"
                style={{ color: "hsl(270 15% 60%)" }}
              >
                Спросить Велию
              </span>

              {/* Mic button */}
              <button
                onClick={handleMicClick}
                disabled={isConnecting}
                className="relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: "hsl(270 20% 18%)",
                  boxShadow: isActive
                    ? "0 0 0 3px #D5A3FF, 0 0 16px #D5A3FF66"
                    : "0 0 0 3px #8A2BE2",
                }}
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Mic className="w-5 h-5 text-white/50" />
                  </motion.div>
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Mini visualizer */}
              <div className="flex-shrink-0">
                <MiniVisualizer isActive={isActive} />
              </div>
            </div>

            {/* Close handle */}
            <motion.div
              className="flex justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            >
              <button
                onClick={onClose}
                className="w-10 h-1 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistPanel;
