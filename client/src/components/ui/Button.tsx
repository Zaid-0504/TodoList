import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "cursor-not-allowed" : ""} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
