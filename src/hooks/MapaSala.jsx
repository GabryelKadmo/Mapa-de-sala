import PropTypes from 'prop-types';
// import './MapaSala.css';

export function MapaSala({
  nomeMapa,
  mapa,
  salas,
  editMode,
  handleEditCadeira,
  handleDragStart,
  handleDrop,
}) {
  const getCorSala = (nomeAluno) => {
    if (!nomeAluno) return "#f5f5f5";
    
    const salaEncontrada = salas.find(sala => 
      sala.alunos.includes(nomeAluno)
    );
    
    if (!salaEncontrada) return "#e3f2fd";
    
    let hash = 0;
    for (let i = 0; i < salaEncontrada.nome.length; i++) {
      hash = salaEncontrada.nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash % 360)}, 60%, 85%)`;
  };

  const getNomeSala = (nomeAluno) => {
    if (!nomeAluno) return "";
    const sala = salas.find(s => s.alunos.includes(nomeAluno));
    return sala ? sala.nome : "";
  };

  return (
    <div className="mapa-container">
      {mapa.length > 0 && (
        <>
          <h2 className="mapa-title">{nomeMapa || "Mapa de Sala"}</h2>
          
          <div className="mapa-sala">
            <div className="column-headers">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`col-${i}`} className="column-header">
                  Fila {i + 1}
                </div>
              ))}
            </div>
            
            <div className="cadeiras-grid">
              {mapa.map((aluno, index) => (
                <div
                  key={`cadeira-${index}`}
                  className={`cadeira-wrapper ${editMode ? 'editable' : ''}`}
                  draggable={editMode}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <div 
                    className="cadeira-label"
                    style={{ backgroundColor: getCorSala(aluno) }}
                  >
                    {getNomeSala(aluno)}
                  </div>
                  <textarea
                    className="cadeira-input"
                    value={aluno}
                    onChange={(e) => handleEditCadeira(index, e.target.value)}
                    placeholder={`Cadeira ${index + 1}`}
                    readOnly={!editMode}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="legenda">
            <h4>Legenda:</h4>
            <div className="legenda-items">
              {salas.map((sala, i) => (
                <div key={`legenda-${i}`} className="legenda-item">
                  <span 
                    className="legenda-color"
                    style={{ backgroundColor: getCorSala(sala.alunos[0]) }}
                  />
                  <span className="legenda-name">{sala.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

MapaSala.propTypes = {
  nomeMapa: PropTypes.string.isRequired,
  mapa: PropTypes.arrayOf(PropTypes.string).isRequired,
  salas: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string.isRequired,
      alunos: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  editMode: PropTypes.bool.isRequired,
  handleEditCadeira: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
};