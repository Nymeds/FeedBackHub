import SearchInput from "./SearchInput";

export default function TopBar() {
  return (
    <div className="fp-top fp-card-inner px-4 min-h-[72px]">
      <SearchInput
        placeholder="Buscar feedback..."
        size="md"
        variant="secondary"
        className="w-full"
        onChange={(e) => console.log("a")}
      />
    </div>
  );
}
