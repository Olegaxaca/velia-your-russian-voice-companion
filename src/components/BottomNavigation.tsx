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
        {/* Убрали justify-around и добавили gap */}
        <div className="glass rounded-2xl p-2 flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                // Добавили flex-1 и убрали px-6
                className={`relative flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
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

                {/* Немного уменьшили иконку */}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : ""}`} />

                {/* Чуть компактнее текст */}
                <span className="text-[11px] font-medium relative z-10">
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
