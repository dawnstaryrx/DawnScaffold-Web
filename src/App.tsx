import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/front/index";
import DocsPage from "@/pages/front/docs";
import PricingPage from "@/pages/front/pricing";
import BlogPage from "@/pages/front/blog";
import AboutPage from "@/pages/front/about";
import RegisterPage from "@/pages/login/RegisterPage";
import LoginPage from "@/pages/login/LoginPage";
import ResetPage from "@/pages/login/ResetPage";
import TestPage from "@/pages/TestPage";
import NotFoundPage from "@/pages/NotFoundPage";


function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ResetPage />} path="/reset" />
      <Route element={<TestPage />} path="/test" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
