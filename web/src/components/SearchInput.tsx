interface SearchInputProps {
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ placeholder, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className="w-full border rounded-lg p-2 mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
