import type { ReactNode } from "react";

type CardVariant = "top" | "main" | "bottom";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

export default function Card({ children, variant = "main", className = "" }: CardProps) {
  const baseClasses =
    "rounded-lg shadow-md flex items-center justify-center font-semibold";

  const variants: Record<CardVariant, string> = {
    top: "h-14 bg-[#800018] text-white shadow-lg tracking-wide",
    main: "h-[520px] bg-[#15a64b] text-white text-lg shadow-xl p-6",
    bottom: "h-14 bg-[#00a3e6] text-white shadow-md",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
