import { Route, Routes } from "react-router-dom";
import InitialPage from "../pages/InitialPage/InitialPage";
import About from "../pages/AboutPage/About";
import SavedMaps from "../pages/SavedMaps/SavedMaps"
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
      <Route path="*" element={<InitialPage />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/mapas-salvos" element={<SavedMaps />} />

    </Routes>
  );
}
