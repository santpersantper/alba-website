import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PostViewerPage from "./pages/PostViewerPage";

function SpaFallbackHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirect = sessionStorage.getItem("alba:redirect");
    if (redirect && redirect !== "/" && redirect !== "") {
      sessionStorage.removeItem("alba:redirect");
      navigate(redirect, { replace: true });
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SpaFallbackHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:postId" element={<PostViewerPage />} />
        <Route path="/post" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
