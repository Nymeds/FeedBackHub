import { createContext, useContext, useState,type ReactNode } from "react";
import ErrorToast from "../components/buildedComponents/ToastCard";

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; duration?: number } | null>(null);

  const showToast = (message: string, duration = 3000) => {
    setToast({ message, duration });
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <ErrorToast message={toast.message} duration={toast.duration} onHide={hideToast} />}
    </ToastContext.Provider>
  );
};
