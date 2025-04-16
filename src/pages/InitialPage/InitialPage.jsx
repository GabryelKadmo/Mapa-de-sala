import { FormularioMapa } from "../../hooks/FormularioMapa";
import { MapaSala } from "../../hooks/MapaSala";
import { ControlesMapa } from "../../hooks/ControlesMapa";
import { useMapaSala } from "../../hooks/useMapaSala";
import "./InitialPage.css";

export default function InitialPage() {
  const {
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
  } = useMapaSala();

  return (
    <div className="app-container">
      <div className="main-content">
        <FormularioMapa
          nomeMapa={nomeMapa}
          setNomeMapa={setNomeMapa}
          cadeiras={cadeiras}
          setCadeiras={setCadeiras}
          salas={salas}
          setSalas={setSalas}
          distribuirAlunos={distribuirAlunos}
          removerSala={removerSala}
        />

        {mapa.length > 0 && (
          <>
            <MapaSala
              nomeMapa={nomeMapa}
              mapa={mapa}
              salas={salas}
              editMode={editMode}
              handleEditCadeira={handleEditCadeira}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />

            <ControlesMapa
              mapa={mapa}
              editMode={editMode}
              setEditMode={setEditMode}
              exportarMapa={exportarMapa}
              salvarMapa={salvarMapa}
              formatoExportacao={formatoExportacao}
              setFormatoExportacao={setFormatoExportacao}
            />
          </>
        )}
      </div>
    </div>
  );
}
