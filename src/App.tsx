import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PostViewerPage from "./pages/PostViewerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:postId" element={<PostViewerPage />} />
        <Route path="/post" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
