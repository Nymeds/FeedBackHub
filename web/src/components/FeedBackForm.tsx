import { useState, type FormEvent } from "react";

interface FeedbackFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function FeedbackForm({ onSubmit, onCancel }: FeedbackFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ titulo, descricao, categoria });
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="border rounded-lg p-3 w-full"
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="border rounded-lg p-3 w-full"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="border rounded-lg p-3 w-full"
      />
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-lg">
          Cancelar
        </button>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Criar
        </button>
      </div>
    </form>
  );
}
