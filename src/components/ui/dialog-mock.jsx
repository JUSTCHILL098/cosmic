import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

// Lightweight dialog / drawer mock (JSX-safe)

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DialogContent = ({ className, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border bg-zinc-950 p-6 shadow-lg",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const DialogHeader = ({ className, children }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
  >
    {children}
  </div>
);

export const DialogTitle = ({ className, children }) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-white",
      className
    )}
  >
    {children}
  </h2>
);

export const DialogDescription = ({ className, children }) => (
  <p className={cn("text-sm text-zinc-400", className)}>
    {children}
  </p>
);

// Drawer aliases (compatibility layer)
export const Drawer = Dialog;
export const DrawerTrigger = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);
export const DrawerContent = DialogContent;
export const DrawerHeader = DialogHeader;
export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
