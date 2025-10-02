import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import FeedbackList from "./pages/FeedbackList";

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<FeedbackList />} />
      
      
      </Routes>
    </ToastProvider>
  );
}