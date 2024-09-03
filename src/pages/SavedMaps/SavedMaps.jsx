import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./SavedMaps.css";

export default function SavedMaps() {
  const navigate = useNavigate();
  const [mapasSalvos, setMapasSalvos] = useState(
    JSON.parse(localStorage.getItem("mapasSalvos")) || []
  );

  const carregarMapa = (index) => {
    const mapaSelecionado = mapasSalvos[index];
    localStorage.setItem("mapaAtual", JSON.stringify(mapaSelecionado));
    navigate("/criar-mapa");
  };

  const excluirMapa = async (index) => {
    const { isConfirmed } = await Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Não",
    });

    if (isConfirmed) {
      const novosMapas = mapasSalvos.filter((_, i) => i !== index);
      localStorage.setItem("mapasSalvos", JSON.stringify(novosMapas));
      setMapasSalvos(novosMapas); // Atualiza o estado para re-renderizar o componente
      Swal.fire("Excluído!", "O mapa foi excluído com sucesso.", "success");
    }
  };

  return (
    <div className="saved-maps-page">
      <div className="content">
        <h1>Mapas Salvos</h1>
        {mapasSalvos.length === 0 ? (
          <p className="no-saved-maps-message">Nenhum mapa encontrado.</p>
        ) : (
          <ul className="saved-maps-list">
            {mapasSalvos.map((mapa, index) => (
              <li key={index} className="saved-map-item">
                <span onClick={() => carregarMapa(index)}>{mapa.nomeSala}</span>
                <button
                  className="delete-map-button"
                  onClick={() => excluirMapa(index)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
