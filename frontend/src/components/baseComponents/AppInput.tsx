import React from "react";
import { Controller, type Control } from "react-hook-form";

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
  multiline?: boolean;
}

export default function AppInput({ control, name, label, error, multiline, ...props }: AppInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="mb-3 w-full">
          {label && <label className="block mb-1 font-semibold text-gray-700">{label}</label>}
          {multiline ? (
            <textarea
              {...field}
              {...props}
              className={`w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                error ? "border-red-500" : ""
              }`}
            />
          ) : (
            <input
              {...field}
              {...props}
              className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                error ? "border-red-500" : ""
              }`}
            />
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
    />
  );
}
