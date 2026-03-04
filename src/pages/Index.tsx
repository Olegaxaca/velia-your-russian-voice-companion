import { useState, useEffect } from "react";
import WaveBackground from "@/components/WaveBackground";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceScreen from "@/components/VoiceScreen";
import TextChatScreen from "@/components/TextChatScreen";
import CharacterScreen from "@/components/CharacterScreen";
import SettingsScreen from "@/components/SettingsScreen";
import AssistPanel from "@/components/AssistPanel";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "voice" | "text" | "character" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("voice");
  const [assistOpen, setAssistOpen] = useState(false);

  // Listen for "assist" trigger (e.g. keyboard shortcut or programmatic)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+A to simulate assist gesture
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setAssistOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case "voice":
        return <VoiceScreen />;
      case "text":
        return <TextChatScreen />;
      case "character":
        return <CharacterScreen />;
      case "settings":
        return <SettingsScreen />;
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden relative">
      {/* Animated wave background */}
      <WaveBackground />

      {/* Main content */}
      <main className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating assist panel overlay */}
      <AssistPanel isOpen={assistOpen} onClose={() => setAssistOpen(false)} />
    </div>
  );
};

export default Index;
