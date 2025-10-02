import React from "react";
import { Controller,type Control } from "react-hook-form";

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
}

export default function AppInput({ control, name, label, error, ...props }: AppInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <div className="flex flex-col mb-2 w-full">
          {label && <label className="mb-1 font-semibold text-gray-700">{label}</label>}
          <input
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
          />
          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
      )}
    />
  );
}
