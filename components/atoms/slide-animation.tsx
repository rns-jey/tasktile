import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface SlideAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export default function SlideAnimation({ children, className }: SlideAnimationProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(className, "overflow-hidden relative rounded-md border")}
    >
      {children}
    </motion.div>
  );
}
