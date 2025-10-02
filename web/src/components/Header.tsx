import { Card } from "./Card";

interface HeaderProps {
  totalFeedbacks?: number;
}

export function Header({ totalFeedbacks }: HeaderProps) {
  return (
    <Card variant="tertiary" size="lg" className="mb-6 text-center">
      <h1 className="text-3xl font-semibold leading-tight text-gray-900 mb-2">
        FeedbackHub
      </h1>
      <p className="text-gray-700 text-sm">Bem-vindo(a) ao FeedbackHub!</p>
      {totalFeedbacks !== undefined && (
        <p className="mt-2 text-gray-600 text-sm font-medium">
          Total de feedbacks: {totalFeedbacks}
        </p>
      )}
    </Card>
  );
}
