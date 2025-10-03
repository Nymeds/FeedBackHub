/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller, type Control } from "react-hook-form";

interface AppInputPropsBase {
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
  multiline?: boolean;
}

// Separar props de input e textarea
type AppInputProps = AppInputPropsBase &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">;

export default function AppInput({
  control,
  name,
  label,
  error,
  multiline = false,
  ...props
}: AppInputProps) {
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
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              className={`w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                error ? "border-red-500" : ""
              }`}
            />
          ) : (
            <input
              {...field}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
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
