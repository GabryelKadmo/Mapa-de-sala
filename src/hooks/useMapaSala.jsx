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

  const exportarMapa = async () => {
    if (mapa.length === 0) {
      Swal.fire("Erro!", "Não há mapa para exportar!", "error");
      return;
    }
  
    const node = document.querySelector(".mapa-sala");
    node.style.backgroundColor = "#FFFFFF";
  
    // Função para obter a cor da sala (baseada no nome da sala)
    const getCorSala = (nomeAluno) => {
      if (!nomeAluno) return "#f5f5f5";
      const sala = salas.find(s => s.alunos.includes(nomeAluno));
      if (!sala) return "#e3f2fd";
      
      let hash = 0;
      for (let i = 0; i < sala.nome.length; i++) {
        hash = sala.nome.charCodeAt(i) + ((hash << 5) - hash);
      }
      return `hsl(${Math.abs(hash % 360)}, 60%, 85%)`;
    };
  
    // Função para obter o nome da sala (abreviado)
    const getAbreviacaoSala = (nomeAluno) => {
      if (!nomeAluno) return "";
      const sala = salas.find(s => s.alunos.includes(nomeAluno));
      if (!sala) return "";
      // Extrai números e letras (ex: "7ºA" → "7A")
      return sala.nome.replace(/[^a-zA-Z0-9]/g, "");
    };
  
    switch (formatoExportacao) {
      case "pdf":
        try {
          const pdf = new jsPDF("p", "mm", "a4");
          pdf.setFontSize(16);
          pdf.text(nomeMapa || "Mapa de Sala", 105, 15, { align: 'center' });
          
          // Configurações da tabela
          const startY = 25;
          const colWidths = [20, 30, 30, 30, 30, 30, 30];
          const cellPadding = 2;
          
          // Adicionar cabeçalho
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, 'bold');
          
          let x = 15;
          pdf.text("", x, startY);
          x += colWidths[0];
          
          for (let i = 1; i <= 6; i++) {
            pdf.text(`FILA ${i}`, x + colWidths[i]/2, startY, { align: 'center' });
            x += colWidths[i];
          }
          
          pdf.setFont(undefined, 'normal');
          
          // Desenhar linhas de separação
          pdf.line(15, startY + 5, 195, startY + 5);
          
          // Preencher as células
          let y = startY + 10;
          const alunosPorLinha = Math.ceil(mapa.length / 6);
          
          for (let linha = 0; linha < alunosPorLinha; linha++) {
            x = 15;
            
            // Nome da sala na primeira coluna
            const primeiroAluno = mapa[linha * 6];
            const nomeSala = getAbreviacaoSala(primeiroAluno);
            pdf.text(nomeSala, x + cellPadding, y + 5);
            x += colWidths[0];
            
            // Alunos nas demais colunas
            for (let fila = 0; fila < 6; fila++) {
              const index = linha * 6 + fila;
              const aluno = mapa[index] || '';
              const corSala = getCorSala(aluno);
              const abreviacaoSala = getAbreviacaoSala(aluno);
              
              // Desenhar quadrado colorido
              pdf.setFillColor(corSala);
              pdf.rect(x + cellPadding, y + cellPadding, 5, 5, 'F');
              
              // Adicionar texto (abreviação da sala e nome do aluno)
              pdf.text(`${abreviacaoSala} ${aluno}`, x + cellPadding + 7, y + 5, {
                maxWidth: colWidths[fila+1] - 10,
                align: 'left'
              });
              
              x += colWidths[fila+1];
            }
            
            y += 10;
            
            // Verificar se precisa de nova página
            if (y > 270 && linha < alunosPorLinha - 1) {
              pdf.addPage();
              y = 20;
            }
          }
          
          pdf.save(`${nomeMapa || 'mapa'}.pdf`);
        } catch (error) {
          console.error("Erro ao gerar PDF:", error);
          Swal.fire("Erro!", "Ocorreu um erro ao gerar o PDF.", "error");
        }
        break;
        
        case "doc":
          try {
            // Criar o conteúdo HTML para o Word
            let htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>${nomeMapa || "Mapa de Sala"}</title>
                <style>
                  @page {
                    size: landscape;
                    margin: 2cm;
                  }
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 0;
                    padding: 0;
                  }
                  h1 { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    font-size: 16pt; 
                  }
                  table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-top: 20px;
                    font-size: 10pt;
                    table-layout: fixed;
                  }
                  th, td { 
                    border: 1px solid #000; 
                    padding: 6px; 
                    text-align: left;
                    vertical-align: middle;
                  }
                  th { 
                    background-color: #f2f2f2; 
                    font-weight: bold;
                    text-align: center;
                  }
                  .sala-abrev-cell {
                    font-weight: bold;
                    width: 30px;
                    text-align: center;
                    background-color: #f8f8f8;
                  }
                  .aluno-cell {
                    width: auto;
                  }
                  .sala-indicator {
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    border: 1px solid #ddd;
                    margin-right: 5px;
                  }
                </style>
              </head>
              <body>
                <h1>${nomeMapa || "Mapa de Sala"}</h1>
                
                <table>
                  <tr>
                    <th colspan="2">FILA 1</th>
                    <th colspan="2">FILA 2</th>
                    <th colspan="2">FILA 3</th>
                    <th colspan="2">FILA 4</th>
                    <th colspan="2">FILA 5</th>
                    <th colspan="2">FILA 6</th>
                  </tr>
            `;
            
            // Organizar os dados
            const alunosPorLinha = Math.ceil(mapa.length / 6);
            
            for (let linha = 0; linha < alunosPorLinha; linha++) {
              htmlContent += `<tr>`;
              
              // Alunos nas colunas (6 filas, cada uma com 2 colunas)
              for (let fila = 0; fila < 6; fila++) {
                const index = linha * 6 + fila;
                const aluno = mapa[index] || '';
                const corSala = getCorSala(aluno);
                const abreviacaoSala = getAbreviacaoSala(aluno);
                
                // Célula com a abreviação da sala
                htmlContent += `<td class="sala-abrev-cell">`;
                if (aluno) {
                  htmlContent += `
                    <span class="sala-indicator" style="background-color: ${corSala}"></span>
                    ${abreviacaoSala}
                  `;
                }
                htmlContent += `</td>`;
                
                // Célula com o nome do aluno
                htmlContent += `<td class="aluno-cell">${aluno}</td>`;
              }
              
              htmlContent += `</tr>`;
            }
            
            htmlContent += `
                </table>
              </body>
              </html>
            `;
      
            // Criar o blob e fazer download
            const blob = new Blob([htmlContent], { 
              type: 'application/msword' 
            });
            saveAs(blob, `${nomeMapa || 'mapa'}.doc`);
          } catch (error) {
            console.error("Erro ao gerar DOC:", error);
            Swal.fire("Erro!", "Ocorreu um erro ao gerar o documento Word.", "error");
          }
          break;
        
      case "image":
        try {
          const dataUrl = await htmlToImage.toPng(node, { 
            quality: 1, 
            pixelRatio: 2, 
            bgcolor: "#FFFFFF" 
          });
          saveAs(dataUrl, `${nomeMapa || 'mapa'}.png`);
        } catch (error) {
          console.error("Erro ao gerar imagem:", error);
          Swal.fire("Erro!", "Ocorreu um erro ao gerar a imagem.", "error");
        }
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