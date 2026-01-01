import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

const CharacterScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Велия</h1>
        <p className="text-muted-foreground text-sm">3D Персонаж</p>
      </motion.div>

      {/* Character placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1 w-full max-w-sm flex items-center justify-center"
      >
        {/* Decorative ring */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full border border-accent/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Placeholder avatar */}
        <motion.div
          className="relative glass rounded-full w-48 h-48 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 40px hsl(270 80% 65% / 0.3)",
              "0 0 60px hsl(270 80% 65% / 0.5)",
              "0 0 40px hsl(270 80% 65% / 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <User className="w-20 h-20 text-primary/60" />
          </div>

          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-accent" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Status message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl px-6 py-4 text-center max-w-sm mb-24"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-accent">В разработке</span>
        </div>
        <p className="text-sm text-muted-foreground">
          3D модель персонажа Велия скоро появится здесь. Следите за обновлениями!
        </p>
      </motion.div>
    </div>
  );
};

export default CharacterScreen;
