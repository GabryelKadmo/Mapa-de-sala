import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-text">© 2024 - Gabryel Kadmo | Gerador de Mapa de Sala</p>
        <ul className="footer-links">
          <li><Link to="https://www.instagram.com/kxdmx.bat/" target="_blank" rel="noopener noreferrer">Instagram</Link></li>
          <li><Link to="https://github.com/GabryelKadmo" target="_blank" rel="noopener noreferrer">Github</Link></li>
          <li><Link to="https://www.linkedin.com/in/gabryel-kadmo/" target="_blank" rel="noopener noreferrer">LinkedIn</Link></li>
        </ul>
      </div>
    </footer>
  );
}
