import { cn } from "@/lib/utils";
import React, { type InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, className, id, type, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);
    
    const isPasswordType = type === "password";
    const currentType = isPasswordType ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium !text-[#000000] dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <div className="relative group">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#059669] transition-colors pointer-events-none text-sm font-bold">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={currentType}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all",
              "!border-[#0000001A] !bg-white !text-gray-700 placeholder:text-gray-400",
              "focus:border-[#059669] focus:outline-none focus:ring-4 focus:ring-[#059669]/10",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
              "disabled:cursor-not-allowed disabled:opacity-60",
              prefix ? "pl-8" : undefined,
              isPasswordType ? "pr-10" : undefined,
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : undefined,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
