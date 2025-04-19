import PropTypes from "prop-types";
import { useState } from "react";

export function FormularioMapa({
  nomeMapa,
  setNomeMapa,
  cadeiras,
  setCadeiras,
  salas,
  setSalas,
  distribuirAlunos,
  removerSala,
}) {
  const [novaSala, setNovaSala] = useState("");
  const [alunosSala, setAlunosSala] = useState("");

  const adicionarSala = () => {
    const nome = novaSala.trim();
    const listaAlunos = alunosSala
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a !== "");

    if (!nome) {
      console.log("Erro!", "Digite o nome da sala.", "error");
      return;
    }

    if (listaAlunos.length === 0) {
      console.log("Erro!", "Adicione pelo menos um aluno.", "error");
      return;
    }

    setSalas([...salas, { nome, alunos: listaAlunos }]);
    setNovaSala("");
    setAlunosSala("");
  };

  return (
    <div className="initial-page">
      <h1>Gerador de Mapa de Sala</h1>

      <div className="input-section">
        <div className="input-group">
          <label>Nome do Mapa:</label>
          <input
            type="text"
            value={nomeMapa}
            onChange={(e) => setNomeMapa(e.target.value)}
            placeholder="Ex: 3º Ano A - Matemática"
          />
        </div>

        <div className="input-group">
          <label>Quantidade de Cadeiras:</label>
          <input
            type="number"
            min="1"
            value={cadeiras || ""}
            onChange={(e) =>
              setCadeiras(Math.max(1, parseInt(e.target.value) || 1))
            }
            placeholder="Número total de lugares"
          />
        </div>
      </div>

      <div className="salas-section">
        <div className="input-group">
          <label>Adicionar Nova Sala:</label>
          <input
            type="text"
            value={novaSala}
            onChange={(e) => setNovaSala(e.target.value)}
            placeholder="Nome da sala (Ex: 3º A)"
            className="sala-input"
          />

          <label>Alunos (um por linha):</label>
          <textarea
            value={alunosSala}
            onChange={(e) => setAlunosSala(e.target.value)}
            placeholder="Digite os nomes dos alunos, um por linha"
            rows={5}
            className="alunos-textarea"
          />

          <button
            onClick={adicionarSala}
            className="add-button"
            disabled={!novaSala.trim() || !alunosSala.trim()}
          >
            + Adicionar Sala
          </button>
        </div>

        <div className="salas-list">
          <h3>Salas Cadastradas ({salas.length}):</h3>
          {salas.length === 0 ? (
            <p className="empty-message">Nenhuma sala adicionada ainda</p>
          ) : (
            <ul>
              {salas.map((sala, index) => (
                <li key={index} className="sala-item">
                  <div className="sala-info">
                    <span className="sala-name">{sala.nome}</span>
                    <span className="sala-count">
                      {sala.alunos.length} alunos
                    </span>
                  </div>
                  <button
                    onClick={() => removerSala(index)}
                    className="remove-button"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="actions" style={{ marginTop: "20px" }}>
        <button
          onClick={distribuirAlunos}
          className="generate-button"
          disabled={salas.length === 0 || cadeiras < 1}
        >
          🎲 Distribuir Alunos
        </button>
      </div>
    </div>
  );
}

FormularioMapa.propTypes = {
  nomeMapa: PropTypes.string.isRequired,
  setNomeMapa: PropTypes.func.isRequired,
  cadeiras: PropTypes.number.isRequired,
  setCadeiras: PropTypes.func.isRequired,
  salas: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string.isRequired,
      alunos: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  setSalas: PropTypes.func.isRequired,
  distribuirAlunos: PropTypes.func.isRequired,
  removerSala: PropTypes.func.isRequired,
};
