import { motion } from "framer-motion";
import {
  Volume2,
  Moon,
  Bell,
  Globe,
  Shield,
  Info,
  ChevronRight,
  Mic,
  Circle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useActivationStyle, ActivationStyle } from "@/hooks/useActivationStyle";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  hasSwitch?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;
}

const SettingItem = ({
  icon,
  title,
  description,
  hasSwitch,
  checked,
  onCheckedChange,
  onClick,
}: SettingItemProps) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer active:bg-secondary/30 transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {hasSwitch ? (
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    )}
  </motion.div>
);

const SettingsScreen = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { style: activationStyle, setStyle: setActivationStyle } = useActivationStyle();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full py-8 px-4 overflow-y-auto pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Настройки</h1>
        <p className="text-muted-foreground text-sm">Настройте приложение</p>
      </motion.div>

      {/* Settings sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* General section */}
        <div>
          <motion.h2
            variants={itemVariants}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1"
          >
            Основные
          </motion.h2>
          <motion.div variants={itemVariants} className="space-y-3">
            <SettingItem
              icon={<Volume2 className="w-5 h-5" />}
              title="Звуковые эффекты"
              description="Звуки интерфейса"
              hasSwitch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
            <SettingItem
              icon={<Moon className="w-5 h-5" />}
              title="Тёмная тема"
              description="Всегда включена"
              hasSwitch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <SettingItem
              icon={<Bell className="w-5 h-5" />}
              title="Уведомления"
              description="Push-уведомления"
              hasSwitch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </motion.div>
        </div>

        {/* Voice section */}
        <div>
          <motion.h2
            variants={itemVariants}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1"
          >
            Голос
          </motion.h2>
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Activation style selector */}
            <div className="glass rounded-xl p-4">
              <p className="font-medium text-foreground mb-3">Стиль активации</p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivationStyle("microphone")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activationStyle === "microphone" 
                      ? "bg-primary/20 border-2 border-primary" 
                      : "bg-secondary/30 border-2 border-transparent"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activationStyle === "microphone" ? "bg-primary" : "bg-secondary"
                  }`}>
                    <Mic className={`w-6 h-6 ${
                      activationStyle === "microphone" ? "text-primary-foreground" : "text-muted-foreground"
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    activationStyle === "microphone" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    Микрофон
                  </span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivationStyle("orb")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activationStyle === "orb" 
                      ? "bg-primary/20 border-2 border-primary" 
                      : "bg-secondary/30 border-2 border-transparent"
                  }`}
                >
                  <div 
                    className={`w-12 h-12 rounded-[35%] flex items-center justify-center ${
                      activationStyle === "orb" ? "" : ""
                    }`}
                    style={{
                      background: activationStyle === "orb"
                        ? "linear-gradient(180deg, hsl(200 85% 50% / 0.8) 0%, hsl(280 70% 50% / 0.9) 100%)"
                        : "linear-gradient(180deg, hsl(220 30% 40% / 0.5) 0%, hsl(260 30% 35% / 0.6) 100%)",
                      boxShadow: activationStyle === "orb" 
                        ? "0 0 15px hsl(200 80% 60% / 0.4)" 
                        : "none"
                    }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        d="M 4 12 Q 8 8, 12 12 T 20 12"
                        fill="none"
                        stroke={activationStyle === "orb" ? "hsl(180 85% 75%)" : "hsl(0 0% 60%)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium ${
                    activationStyle === "orb" ? "text-primary" : "text-muted-foreground"
                  }`}>
                    Сфера
                  </span>
                </motion.button>
              </div>
            </div>
            
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              title="Язык"
              description="Русский"
            />
          </motion.div>
        </div>

        {/* Other section */}
        <div>
          <motion.h2
            variants={itemVariants}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1"
          >
            Другое
          </motion.h2>
          <motion.div variants={itemVariants} className="space-y-3">
            <SettingItem
              icon={<Shield className="w-5 h-5" />}
              title="Конфиденциальность"
              description="Управление данными"
            />
            <SettingItem
              icon={<Info className="w-5 h-5" />}
              title="О приложении"
              description="Версия 0.1.0 (тест)"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Велия • Голосовой помощник
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Тестовая версия для Android
        </p>
      </motion.div>
    </div>
  );
};

export default SettingsScreen;
