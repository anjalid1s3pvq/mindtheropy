import { motion } from "framer-motion";

export function VoiceVisualizer({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: [4, 16, 4],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
