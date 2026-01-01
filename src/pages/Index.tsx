import { useState } from "react";
import WaveBackground from "@/components/WaveBackground";
import BottomNavigation from "@/components/BottomNavigation";
import VoiceScreen from "@/components/VoiceScreen";
import CharacterScreen from "@/components/CharacterScreen";
import SettingsScreen from "@/components/SettingsScreen";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "voice" | "character" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("voice");

  const renderScreen = () => {
    switch (activeTab) {
      case "voice":
        return <VoiceScreen />;
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
    </div>
  );
};

export default Index;
