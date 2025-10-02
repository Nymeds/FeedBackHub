import { tv } from "tailwind-variants";
import React from "react";

export const CardVariants = tv({
  base: `rounded transition animate-pulse`,
  variants: {
    variant: {
      primary: "bg-white border border-gray-200",
      secondary: "bg-gray-100 border border-gray-200",
      tertiary: "bg-gray-200 border border-gray-300",
    },
    size: {
      none: "",
      md: "p-3",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type SkeletonCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "none" | "md" | "lg";
};

export function Card({ variant, size, className = "", ...props }: SkeletonCardProps) {
  return (
    <div className={CardVariants({ variant, size, className })} {...props}>
      <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-10 bg-gray-300 rounded mb-4"></div>
      <div className="flex items-center justify-between mt-auto">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
}
