import type { InputHTMLAttributes } from "react";
import { FaSearch } from "react-icons/fa";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function SearchInput({ className = "", ...props }: Props) {
  return (
    <div className={`relative ${className}`}>
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="w-full pl-10 pr-3 h-10 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}