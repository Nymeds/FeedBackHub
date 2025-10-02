import { Routes, Route } from "react-router-dom";
import FeedbackList from "./pages/FeedbackList";
//import FeedbackDetail from "./pages/FeedbackDetail";
//<Route path="/feedback/:idfeedback" element={<FeedbackDetail />} />
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedbackList />} />
      
    </Routes>
  );
}
