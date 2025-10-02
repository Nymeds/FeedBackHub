import type { HTMLAttributes } from "react";

export default function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        `bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-soft ${className}`
      }
      {...props}
    >
      {children}
    </div>
  );
}