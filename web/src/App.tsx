import { Routes, Route } from "react-router-dom";
import FeedbackPage from "./pages/FeedbackPage";

export function App() {
  return (
   
      <Routes>
        <Route path="/" element={<FeedbackPage />} />
      </Routes>
    
  );
}