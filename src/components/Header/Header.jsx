import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Gerador de Mapa
      </Link>
      <nav className="nav">
        <Link to="/" className="nav-button">
          Home
        </Link>
        <Link to="/mapas-salvos" className="nav-button">
          Mapas
        </Link>
        {/* <Link to="/sobre" className="nav-button">
          Sobre
        </Link> */}
      </nav>
    </header>
  );
}
