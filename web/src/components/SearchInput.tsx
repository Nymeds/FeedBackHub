import type { InputHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: "w-full rounded-lg border outline-none transition",
  variants: {
    variant: {
      default: "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300",
      error: "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-300",
    },
    inputSize: {
      sm: "text-sm py-1 px-2",
      md: "text-base py-2 px-3",
      lg: "text-lg py-3 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    inputSize: "md",
  },
});

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}


export default function SearchInput({
  variant,
  inputSize,
  className,
  ...props
}: SearchInputProps) {
  return <input className={inputVariants({ variant, inputSize, className })} {...props} />;
}
