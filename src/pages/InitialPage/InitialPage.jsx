import { useState } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import "./InitialPage.css";

export default function InitialPage() {
  const [nomeSala, setNomeSala] = useState("");
  const [cadeiras, setCadeiras] = useState(0);
  const [alunos, setAlunos] = useState("");
  const [mapa, setMapa] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [formatoExportacao, setFormatoExportacao] = useState("image");
  const [editMode, setEditMode] = useState(false);

  const gerarMapa = () => {
    const listaAlunos = alunos
      .split("\n")
      .map((aluno) => aluno.trim())
      .filter((aluno) => aluno !== "");
    const alunosEmbaralhados = listaAlunos.sort(() => Math.random() - 0.5);
    const novoMapa = [];

    for (let i = 0; i < cadeiras; i++) {
      novoMapa.push(alunosEmbaralhados[i] || "");
    }

    setMapa(novoMapa);
  };

  const handleEditCadeira = (index, novoValor) => {
    const novoMapa = [...mapa];
    novoMapa[index] = novoValor;
    setMapa(novoMapa);
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      const novoMapa = [...mapa];
      [novoMapa[draggingIndex], novoMapa[index]] = [
        novoMapa[index],
        novoMapa[draggingIndex],
      ];
      setMapa(novoMapa);
    }
    setDraggingIndex(null);
  };

  const exportarMapa = () => {
    if (mapa.length === 0) {
      alert("Não há mapa para exportar!");
      return;
    }

    const node = document.querySelector(".mapa-sala");

    switch (formatoExportacao) {
      case "pdf": {
        htmlToImage.toPng(node).then((dataUrl) => {
          const pdf = new jsPDF("p", "mm", "a4");
          pdf.addImage(dataUrl, "PNG", 10, 10, 190, 0);
          pdf.save(`${nomeSala}.pdf`);
        });
        break;
      }
      case "doc": {
        const blob = new Blob(
          [document.querySelector(".mapa-sala").outerHTML],
          {
            type: "application/msword",
          }
        );
        saveAs(blob, `${nomeSala}.doc`);
        break;
      }
      case "image": {
        htmlToImage
          .toPng(node, { quality: 1, pixelRatio: 2 })
          .then((dataUrl) => {
            saveAs(dataUrl, `${nomeSala}.png`);
          });
        break;
      }
      default:
        alert("Formato não suportado!");
    }
  };

  return (
    <div className="initial-page">
      <h1>Gerar Mapa de Sala</h1>
      <div className="input-group">
        <label>Nome da Sala:</label>
        <input
          type="text"
          value={nomeSala}
          onChange={(e) => setNomeSala(e.target.value)}
          placeholder="Digite o nome da sala"
        />
      </div>
      <div className="input-group">
        <label>Quantidade de Cadeiras:</label>
        <input
          type="number"
          value={cadeiras}
          onChange={(e) => setCadeiras(e.target.value)}
          placeholder="Digite o número de cadeiras"
        />
      </div>
      <div className="input-group">
        <label>Lista de Alunos (um por linha):</label>
        <textarea
          value={alunos}
          onChange={(e) => setAlunos(e.target.value)}
          placeholder="Cole a lista de nomes dos alunos, um por linha"
        />
      </div>
      <button className="GenerateMapButton" onClick={gerarMapa}>
        Gerar Mapa
      </button>

      <div className="mapa-sala">
  <h2>{nomeSala}</h2>
  <div className="fila-labels">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="fila-label">
        Fila {i + 1}
      </div>
    ))}
  </div>
  <div className="cadeiras">
    {mapa.map((aluno, index) => (
      <textarea
        key={index}
        className="cadeira"
        value={aluno}
        onChange={(e) => handleEditCadeira(index, e.target.value)}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(index)}
        placeholder={`Cadeira ${index + 1}`}
        readOnly={!editMode}
      />
    ))}
  </div>
</div>


      <div className="exportar-mapa">
        <label>Escolha o formato de exportação:</label>
        <select
          value={formatoExportacao}
          onChange={(e) => setFormatoExportacao(e.target.value)}
        >
          <option value="image">Imagem (PNG)</option>
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
        </select>
        <button
          onClick={exportarMapa}
          className="botao-exportar"
          disabled={mapa.length === 0}
        >
          Exportar Mapa
        </button>
        {mapa.length > 0 && (
          <button
            className={`edit-icon ${editMode ? "active" : ""}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Desativar edição ✏️" : "Habilitar edição ✏️"}
          </button>
        )}
      </div>
    </div>
  );
}
