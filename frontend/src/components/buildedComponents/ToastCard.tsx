import React, { useEffect, useState } from "react";

interface ErrorToastProps {
  message: string;
  onHide: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onHide, duration = 3000 }: ErrorToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onHide, 300); // espera animação desaparecer
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onHide]);

  return (
    <div
      className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } z-50`}
    >
      {message}
    </div>
  );
}
