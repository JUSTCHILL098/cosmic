import React from "react";
import { cn } from "../../lib/utils";

// Simple button without Radix or TS
export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
