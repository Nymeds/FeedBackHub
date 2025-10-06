/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import ErrorToast from "../components/buildedComponents/ToastCard";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, duration?: number, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    duration?: number;
    type?: ToastType;
  } | null>(null);

  const showToast = (
    message: string,
    duration = 3000,
    type: ToastType = "error" 
  ) => {
    setToast({ message, duration, type });
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ErrorToast
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};
