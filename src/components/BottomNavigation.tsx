import { Mic, MessageSquare, User, Settings } from "lucide-react";
import { motion } from "framer-motion";

type Tab = "voice" | "text" | "character" | "settings";

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "voice" as Tab, icon: Mic, label: "Голос" },
    { id: "text" as Tab, icon: MessageSquare, label: "Текст" },
    { id: "character" as Tab, icon: User, label: "Велия" },
    { id: "settings" as Tab, icon: Settings, label: "Настройки" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-4 mb-4">
        <div className="glass rounded-2xl p-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/15 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={`w-6 h-6 relative z-10 ${isActive ? "text-primary" : ""}`} />
                <span className="text-xs font-medium relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
