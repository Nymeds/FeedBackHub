import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";


const buttonVariants = tv({
  base: "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full font-bold shadow-lg transition active:scale-95 focus:outline-none",
  variants: {
    variant: {
      primary:
        "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed",
    },
    size: {
      sm: "py-2 px-5 text-sm",
      md: "py-3 px-8 text-base",
      lg: "py-4 px-10 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});


interface BottomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  title: string;
}

export default function BottomButton({
  title,
  variant,
  size,
  className,
  ...props
}: BottomButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {title}
    </button>
  );
}
