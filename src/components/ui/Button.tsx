import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, variant = "primary", size = "md", disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 select-none";
    
    const variants = {
      primary: "bg-primary text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 border border-transparent",
      secondary: "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300",
      outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger: "bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 hover:border-rose-200 shadow-sm",
      link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-11 px-5",
      lg: "h-14 px-8 text-base",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };