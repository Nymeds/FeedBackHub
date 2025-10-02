import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import FeedbackList from "./pages/FeedbackList";
import FeedbackDetail from "./pages/FeedbackDetail";
import FeedbackForm from "./pages/FeedbackForm";

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<FeedbackList />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
        <Route path="/feedback/edit/:id" element={<FeedbackForm />} />
        <Route path="/feedback/new" element={<FeedbackForm />} /> {/* Adicione esta linha */}
      </Routes>
    </ToastProvider>
  );
}