import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, ...props }, ref) => {
    return (
      <div className="w-full relative space-y-1.5">
        {label && (
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "flex w-full h-11 appearance-none items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              error && "border-rose-500 focus:ring-rose-200",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none opacity-80" />
        </div>
        {error && (
          <p className="text-[10px] text-rose-500 font-medium ml-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };