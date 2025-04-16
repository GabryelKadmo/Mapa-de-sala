import { useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

export function useMapaSala() {
  const [salas, setSalas] = useState([]);
  const [nomeMapa, setNomeMapa] = useState("");
  const [cadeiras, setCadeiras] = useState(0);
  const [mapa, setMapa] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [formatoExportacao, setFormatoExportacao] = useState("image");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const mapaAtual = JSON.parse(localStorage.getItem("mapaAtual"));
    if (mapaAtual) {
      setNomeMapa(mapaAtual.nomeMapa);
      setCadeiras(mapaAtual.cadeiras);
      setSalas(mapaAtual.salas || []);
      setMapa(mapaAtual.mapa || []);
      localStorage.removeItem("mapaAtual");
    }
  }, []);

  const distribuirAlunos = () => {
    if (salas.length === 0 || cadeiras === 0) {
      Swal.fire("Erro!", "Adicione salas e defina o número de cadeiras.", "error");
      return;
    }

    const totalAlunos = salas.reduce((total, sala) => total + sala.alunos.length, 0);
    if (totalAlunos > cadeiras) {
      Swal.fire("Aviso!", "Há mais alunos que cadeiras disponíveis.", "warning");
    }

    const alunosMarcados = [];
    salas.forEach(sala => {
      sala.alunos.forEach(aluno => {
        alunosMarcados.push({ nome: aluno, sala: sala.nome });
      });
    });

    const alunosEmbaralhados = [...alunosMarcados].sort(() => Math.random() - 0.5);
    const novoMapa = new Array(cadeiras).fill(null);

    for (let i = 0; i < novoMapa.length; i++) {
      const alunoIndex = alunosEmbaralhados.findIndex(aluno => {
        const prev = novoMapa[i-1];
        const next = novoMapa[i+1];
        return (!prev || prev.sala !== aluno.sala) && 
               (!next || next.sala !== aluno.sala);
      });

      if (alunoIndex >= 0) {
        novoMapa[i] = alunosEmbaralhados[alunoIndex].nome;
        alunosEmbaralhados.splice(alunoIndex, 1);
      } else if (alunosEmbaralhados.length > 0) {
        novoMapa[i] = alunosEmbaralhados.pop().nome;
      } else {
        novoMapa[i] = "";
      }
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
      Swal.fire("Erro!", "Não há mapa para exportar!", "error");
      return;
    }

    const node = document.querySelector(".mapa-sala");
    node.style.backgroundColor = "#FFFFFF";

    switch (formatoExportacao) {
      case "pdf":
        htmlToImage.toPng(node, { bgcolor: "#FFFFFF" }).then((dataUrl) => {
          const pdf = new jsPDF("p", "mm", "a4");
          pdf.addImage(dataUrl, "PNG", 10, 10, 190, 0);
          pdf.save(`${nomeMapa}.pdf`);
        });
        break;
      case "doc": {
        const blob = new Blob([node.outerHTML], { type: "application/msword" });
        saveAs(blob, `${nomeMapa}.doc`);
        break;
      }
      case "image":
        htmlToImage.toPng(node, { quality: 1, pixelRatio: 2, bgcolor: "#FFFFFF" })
          .then((dataUrl) => saveAs(dataUrl, `${nomeMapa}.png`));
        break;
      default:
        Swal.fire("Erro!", "Formato não suportado!", "error");
    }

    node.style.backgroundColor = "#fff";
  };

  const salvarMapa = () => {
    if (!nomeMapa) {
      Swal.fire("Erro!", "Digite um nome para o mapa.", "error");
      return;
    }

    const mapasSalvos = JSON.parse(localStorage.getItem("mapasSalvos")) || [];
    const novoMapa = { nomeMapa, cadeiras, salas, mapa };

    const mapaExistenteIndex = mapasSalvos.findIndex(
      m => m.nomeMapa === nomeMapa
    );

    if (mapaExistenteIndex !== -1) {
      mapasSalvos[mapaExistenteIndex] = novoMapa;
      Swal.fire("Atualizado!", "Mapa atualizado com sucesso!", "success");
    } else {
      mapasSalvos.push(novoMapa);
      Swal.fire("Salvo!", "Mapa salvo com sucesso!", "success");
    }

    localStorage.setItem("mapasSalvos", JSON.stringify(mapasSalvos));
  };

  const removerSala = (index) => {
    const novasSalas = [...salas];
    novasSalas.splice(index, 1);
    setSalas(novasSalas);
  };

  return {
    salas,
    setSalas,
    nomeMapa,
    setNomeMapa,
    cadeiras,
    setCadeiras,
    mapa,
    distribuirAlunos,
    handleEditCadeira,
    handleDragStart,
    handleDrop,
    formatoExportacao,
    setFormatoExportacao,
    editMode,
    setEditMode,
    exportarMapa,
    salvarMapa,
    removerSala,
  };
}