import React, { useEffect, useState } from "react";

interface ErrorToastProps {
  message: string;
  onHide: () => void;
  duration?: number;
  type?: "success" | "error";
}

export default function ErrorToast({
  message,
  onHide,
  duration = 3000,
  type = "error",
}: ErrorToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onHide, 300); 
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onHide]);

  // Define cor 
  const bgColor =
    type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 ${bgColor} text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } z-50`}
    >
      {message}
    </div>
  );
}
