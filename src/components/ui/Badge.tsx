import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary hover:bg-primary/20 border-transparent",
    success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent",
    warning: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-transparent",
    danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-transparent",
    neutral: "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent",
    outline: "text-slate-600 border-slate-200 hover:bg-slate-50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };