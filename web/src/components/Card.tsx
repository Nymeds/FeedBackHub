import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-xl shadow-md transition hover:shadow-lg border",
  variants: {
    variant: {
      default: "bg-white border-gray-200 text-gray-900",
      primary: "bg-purple-600 text-white border-purple-600",
      secondary: "bg-gray-100 text-gray-900 border-gray-200",
      success: "bg-green-50 text-green-900 border-green-200",
      warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
      error: "bg-red-50 text-red-900 border-red-200",
    },
    size: {
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    },
    floating: {
      true: "backdrop-blur-sm bg-white/10 border-white/20 shadow-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    floating: false,
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, variant, size, floating, className }: CardProps) {
  return (
    <div className={cardVariants({ variant, size, floating, className })}>
      {children}
    </div>
  );
}
