import { motion } from "framer-motion";

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated waves */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[60%]"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(280 60% 60% / 0.3)" />
            <stop offset="100%" stopColor="hsl(270 50% 40% / 0.1)" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(290 70% 65% / 0.2)" />
            <stop offset="100%" stopColor="hsl(270 40% 35% / 0.05)" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(270 80% 70% / 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <motion.path
          d="M0,160 C320,220 420,100 640,160 C860,220 1120,100 1440,160 L1440,400 L0,400 Z"
          fill="url(#wave1)"
          animate={{
            d: [
              "M0,160 C320,220 420,100 640,160 C860,220 1120,100 1440,160 L1440,400 L0,400 Z",
              "M0,180 C320,120 420,200 640,140 C860,80 1120,180 1440,140 L1440,400 L0,400 Z",
              "M0,160 C320,220 420,100 640,160 C860,220 1120,100 1440,160 L1440,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M0,200 C280,260 380,180 580,220 C780,260 980,180 1200,220 C1320,240 1400,200 1440,200 L1440,400 L0,400 Z"
          fill="url(#wave2)"
          animate={{
            d: [
              "M0,200 C280,260 380,180 580,220 C780,260 980,180 1200,220 C1320,240 1400,200 1440,200 L1440,400 L0,400 Z",
              "M0,220 C280,160 380,240 580,200 C780,160 980,240 1200,200 C1320,180 1400,220 1440,220 L1440,400 L0,400 Z",
              "M0,200 C280,260 380,180 580,220 C780,260 980,180 1200,220 C1320,240 1400,200 1440,200 L1440,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <motion.path
          d="M0,280 C360,320 460,260 720,300 C980,340 1080,280 1440,300 L1440,400 L0,400 Z"
          fill="url(#wave3)"
          animate={{
            d: [
              "M0,280 C360,320 460,260 720,300 C980,340 1080,280 1440,300 L1440,400 L0,400 Z",
              "M0,300 C360,260 460,320 720,280 C980,240 1080,300 1440,280 L1440,400 L0,400 Z",
              "M0,280 C360,320 460,260 720,300 C980,340 1080,280 1440,300 L1440,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 left-5 w-24 h-24 rounded-full bg-accent/20 blur-2xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};

export default WaveBackground;
