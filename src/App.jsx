import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/routes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}
