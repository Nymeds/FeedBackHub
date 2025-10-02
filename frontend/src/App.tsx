import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import FeedbackDetailPage from "./pages/FeedBackDetails";
import FeedbackFormPage from "./pages/FeedBackForm";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/:idfeedback" element={<FeedbackDetailPage />} />
      <Route path="/feedback" element={<FeedbackFormPage />} /> 
      <Route path="/feedback/:idfeedback" element={<FeedbackFormPage />} /> 
    </Routes>
  );
}
