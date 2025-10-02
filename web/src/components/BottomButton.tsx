interface BottomButtonProps {
  title: string;
  onClick: () => void;
}

export function Button({ title, onClick }: BottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      {title}
    </button>
  );
}
