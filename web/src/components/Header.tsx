import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">FeedbackHub</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
            Gerencie seus feedbacks de forma simples e eficiente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/feedback/new")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm"
          >
            Criar novo
          </button>
        </div>
      </div>
    </header>
  );
}