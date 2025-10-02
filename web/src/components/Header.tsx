import Card from "./Card";

interface HeaderProps {
  title: string;
  subtitle?: string;
  date?: string;
  className?: string;
}

export default function Header({ title, subtitle, date, className }: HeaderProps) {
  return (
    <div className={`w-full max-w-3xl mx-auto ${className ?? ""}`}>
      <Card variant="secondary" size="lg" className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600 dark:text-gray-300 mb-1">{subtitle}</p>}
        {date && <p className="text-gray-500 dark:text-gray-400 text-sm">{date}</p>}
      </Card>
    </div>
  );
}
