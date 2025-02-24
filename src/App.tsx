import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./components/home";
import ProjectDetail from "./components/ProjectDetail";
import Work from "./components/Work";
import About from "./components/About";
import Social from "./components/Social";
import Contact from "./components/Contact";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import routes from "tempo-routes";
import { PageTransitionProvider } from "./components/PageTransitionProvider";

function App() {
  return (
    <PageTransitionProvider>
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-white">
              <div className="text-xl text-zinc-900">Loading...</div>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/works" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/social" element={<Social />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
              </Route>
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </PageTransitionProvider>
  );
}

export default App;
