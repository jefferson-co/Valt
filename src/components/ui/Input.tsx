import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, dark = false, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block font-medium",
              dark
                ? "text-[13px] text-white/50"
                : "text-sm text-[#374151]"
            )}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg px-4 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            dark
              ? "border border-white/10 bg-[#0A0A0A] text-white placeholder:text-white/25 focus:border-white/30"
              : "border border-[#D1D5DB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#6B7280] focus:ring-2 focus:ring-gray-100",
            error && !dark && "border-red-400 focus:border-red-400",
            error && dark && "border-red-400/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className={cn("text-sm", dark ? "text-red-400" : "text-red-500")}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
