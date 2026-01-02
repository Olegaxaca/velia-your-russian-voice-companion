import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  isActive: boolean;
  analyserNode: AnalyserNode | null;
}

const AudioVisualizer = ({ isActive, analyserNode }: AudioVisualizerProps) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);
  const barCount = 12;

  useEffect(() => {
    if (!isActive || !analyserNode) {
      // Reset bars when not active
      barsRef.current.forEach((bar) => {
        if (bar) {
          bar.style.height = "8px";
        }
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    const animate = () => {
      analyserNode.getByteFrequencyData(dataArray);

      // Sample frequency data for each bar
      const step = Math.floor(dataArray.length / barCount);
      
      barsRef.current.forEach((bar, index) => {
        if (!bar) return;
        
        // Get average of a range of frequencies for smoother visualization
        let sum = 0;
        for (let i = 0; i < step; i++) {
          sum += dataArray[index * step + i] || 0;
        }
        const average = sum / step;
        
        // Map to height (min 8px, max 60px)
        const height = Math.max(8, (average / 255) * 60);
        bar.style.height = `${height}px`;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, analyserNode, barCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center gap-1 h-16"
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          initial={{ height: 8 }}
          className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent transition-all duration-75"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        />
      ))}
    </motion.div>
  );
};

export default AudioVisualizer;
