import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

export function ControlesMapa({
  mapa,
  editMode,
  setEditMode,
  exportarMapa,
  salvarMapa,
  formatoExportacao,
  setFormatoExportacao,
}) {
  const toggleEditMode = () => {
    const newMode = !editMode;
    setEditMode(newMode);
    Swal.fire({
      title: newMode ? "Modo Edição Ativado" : "Modo Edição Desativado",
      icon: "info",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="controles-container">
      <div className="export-controls">
        <div className="format-selector">
          <label>Formato de Exportação:</label>
          <select
            value={formatoExportacao}
            onChange={(e) => setFormatoExportacao(e.target.value)}
          >
            <option value="image">Imagem (PNG)</option>
            <option value="pdf">PDF</option>
            <option value="doc">Documento (DOC)</option>
          </select>
        </div>
        
        <button
          onClick={exportarMapa}
          className="export-button"
          disabled={mapa.length === 0}
        >
          💾 Exportar Mapa
        </button>
      </div>

      {mapa.length > 0 && (
        <div className="edit-controls">
          <button
            onClick={toggleEditMode}
            className={`edit-button ${editMode ? 'active' : ''}`}
          >
            {editMode ? '🔒 Travar Posições' : '✏️ Editar Posições'}
          </button>
          
          <button
            onClick={salvarMapa}
            className="save-button"
          >
            ⭐ Salvar Mapa
          </button>
        </div>
      )}
    </div>
  );
}

ControlesMapa.propTypes = {
  mapa: PropTypes.arrayOf(PropTypes.string).isRequired,
  editMode: PropTypes.bool.isRequired,
  setEditMode: PropTypes.func.isRequired,
  exportarMapa: PropTypes.func.isRequired,
  salvarMapa: PropTypes.func.isRequired,
  formatoExportacao: PropTypes.oneOf(['image', 'pdf', 'doc']).isRequired,
  setFormatoExportacao: PropTypes.func.isRequired,
};