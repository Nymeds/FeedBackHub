import type { ReactNode } from "react";
interface CardContainerProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function CardContainer({ title, children, className = "" }: CardContainerProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
