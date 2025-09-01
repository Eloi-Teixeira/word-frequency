import { useState } from 'react';
import { useNotes } from '../../context/notesContext';

export default function UserStats() {
  const [load, setload] = useState();
  const { notes } = useNotes();

  const totalNotes = notes.length;
  const totalCaracters = notes.reduce(
    (acc, note) => acc + note.content.length,
    0,
  );
  const totalWords = notes.reduce(
    (acc, note) => acc + note.content.split(/\s+/).filter(Boolean).length,
    0,
  );
  const averageWordsPerNote =
    totalNotes === 0 ? 0 : Math.round(totalWords / totalNotes);
  const averageCaractersPerNote =
    totalNotes === 0 ? 0 : Math.round(totalCaracters / totalNotes);
  const sortedNotes = notes.sort((a, b) => b.content.length - a.content.length);

  const dateToString = (date: string | Date): string => {
    const newDate = new Date(date);
    return `${newDate.getDate().toString().padStart(2, '0')}/${newDate
      .getMonth()
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  };

  return (
    <section className="user-stats">
      <div className="stats-grid">
        <div className="stats-card">
          <h2 className="section-title">Estatísticas de usuário</h2>
          <div className="stat-item">
            <p>Anotações criadas:</p>
            <span>{totalNotes}</span>
          </div>
          <div className="stat-item">
            <p>Total de Caracteres:</p>
            <span>{totalCaracters}</span>
          </div>
          <div className="stat-item">
            <p>Total de palavras</p>
            <span>{totalWords}</span>
          </div>
          <div className="stat-item">
            <p>Média de palavras por nota:</p>
            <span>{averageWordsPerNote}</span>
          </div>
          <div className="stat-item">
            <p>Média de caracteres por nota:</p>
            <span>{averageCaractersPerNote}</span>
          </div>
          <div className="stat-item">
            <p>Anotações fixadas:</p>
            <span>{notes.filter((n) => n.pinned).length}</span>
          </div>
        </div>

        {/* 
        - Fazer com que as configurações abaixo sejam fixas e definidas pelo usuário e que, ao clicar, apareça um modal para alterar as configurações
         */}

        <div className="user-config stats-card">
          <h2 className="section-title">Configurações</h2>
          <div className="config-section">
            <div className="config-item">
              <label htmlFor="de">Lopso</label>
              <input type="checkbox" name="de" />
            </div>
            <div className="config-item">
              <label htmlFor="color">Cor Principal</label>
              <input type="color" name="color" />
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="stats-card">
          <h2 className="section-title">Anotações fixadas</h2>
          <ul>
            {notes.filter((note) => note.pinned).length === 0 ? (
              <li className="no-content">Nenhuma anotação fixada</li>
            ) : (
              notes
                .filter((note) => note.pinned)
                .slice(0, 3)
                .map((note) => (
                  <li key={note._id} className="annotation-item">
                    <span className="annotation-title">{note.title}</span>
                    <div className="annotation-meta">
                      <span>Atualizado: {dateToString(note.updatedAt)}</span>
                      <div className="annotation-tags">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="annotation-tag">
                            {tag}
                          </span>
                        )) || ''}
                      </div>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>

        <div className="stats-card">
          <h2 className="section-title">Maiores Anotações</h2>
          <ul>
            {notes.length === 0 ? (
              <li className="no-content">Nenhuma anotação encontrada</li>
            ) : (
              sortedNotes.slice(0, 5).map((note) => (
                <li key={note._id} className="annotation-item">
                  <span className="annotation-title">{note.title}</span>{' '}
                  <div>
                    <span>{note.content.length} caracteres</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
