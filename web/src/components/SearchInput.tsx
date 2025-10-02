import { Search } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  iconSize?: number;
  iconColor?: string;
  buttonText?: string;
  inputSize?: "sm" | "md" | "lg"; 
  variant?: "primary" | "secondary";
  className?: string;
}

export default function SearchInput({
  placeholder = "Buscar feedback...",
  iconSize,
  iconColor,
  buttonText = "Buscar",
  inputSize = "md",
  variant = "primary",
  className,
  ...props
}: SearchInputProps) {
  const sizeStyles = {
    sm: "pl-10 pr-24 py-2 text-sm rounded-md",
    md: "pl-12 pr-28 py-3 text-base rounded-lg",
    lg: "pl-14 pr-32 py-4 text-lg rounded-xl",
  };

  const variantStyles = {
    primary: {
      input: "bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
      button: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white",
      iconColor: iconColor || "#9ca3af",
    },
    secondary: {
      input: "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900",
      button: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white",
      iconColor: iconColor || "#6b7280",
    },
  };

  const styles = variantStyles[variant];

  return (
    <form className={clsx("max-w-3xl mx-auto", className)} onSubmit={e => e.preventDefault()}>
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search
            size={iconSize || (inputSize === "sm" ? 16 : inputSize === "md" ? 20 : 24)}
            color={styles.iconColor}
          />
        </div>
        <input
          type="search"
          id="search-input"
          placeholder={placeholder}
          className={clsx(
            "block w-full outline-none shadow-sm transition duration-200 hover:shadow-md",
            sizeStyles[inputSize],
            styles.input
          )}
          required
          {...props}
        />
        <button
          type="submit"
          className={clsx(
            "absolute right-2.5 bottom-2.5 font-medium text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition duration-200",
            inputSize === "sm" && "px-3 py-1 text-xs rounded-md",
            inputSize === "lg" && "px-5 py-3 text-lg rounded-xl",
            styles.button
          )}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
