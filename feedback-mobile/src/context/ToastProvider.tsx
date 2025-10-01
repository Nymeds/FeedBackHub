import React, { createContext, useContext, useState, ReactNode } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ErrorToast from "../components/ToastCard";

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

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
