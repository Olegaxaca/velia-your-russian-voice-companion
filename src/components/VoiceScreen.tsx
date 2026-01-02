import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MicrophoneButton from "./MicrophoneButton";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

const VoiceScreen = () => {
  const { 
    messages, 
    isConnected, 
    isConnecting, 
    isSpeaking, 
    isListening,
    connect, 
    disconnect 
  } = useRealtimeChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMicClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Велия</h1>
        <p className="text-muted-foreground text-sm">
          {isConnected ? "Голосовой режим активен" : "Ваш голосовой помощник"}
        </p>
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 w-full max-w-sm overflow-y-auto py-8 px-2">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${message.isUser ? "ml-auto" : "mr-auto"} max-w-[85%]`}
            >
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Microphone button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-24"
      >
        <MicrophoneButton 
          isListening={isListening}
          isSpeaking={isSpeaking}
          isConnecting={isConnecting}
          isConnected={isConnected}
          onClick={handleMicClick}
        />
      </motion.div>
    </div>
  );
};

export default VoiceScreen;
