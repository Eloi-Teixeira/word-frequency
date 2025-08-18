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

  const datetoString = (date: string | Date): string => {
    const newDate = new Date(date);
    return `${newDate.getDate().toString().padStart(2, '0')}/${newDate
      .getMonth()
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  };

  return (
    <section className="user-stats">
      <div className="container table">
        <h2>Estatísticas de usuário</h2>
        <div>
          <p>Anotações criadas:</p>
          <span>{totalNotes}</span>

          <p>Total de Caracteres:</p>
          <span>{totalCaracters}</span>

          <p>Total de palavras</p>
          <span>{totalWords}</span>

          <p>Média de palavras por nota:</p>
          <span>{averageWordsPerNote}</span>

          <p>Média de caracteres por nota:</p>
          <span>{averageCaractersPerNote}</span>

          <p>Anotações fixadas:</p>
          <span>{notes.filter((n) => n.pinned).length}</span>
        </div>
      </div>

      <div className="container">
        <h2>Anotações fixadas</h2>
        <ul>
          {notes.filter((note) => note.pinned).length === 0 ? (
            <li className="no-content">Nenhuma anotação fixada</li>
          ) : (
            notes
              .filter((note) => note.pinned)
              .slice(0, 3)
              .map((note) => (
                <li key={note._id} className="note">
                  {note.title}
                  <br /> Atualizado: {datetoString(note.updatedAt)}
                </li>
              ))
          )}
        </ul>
      </div>

      <div className="container">
        <h2>Maiores Anotações</h2>
        <ul>
          {notes.length === 0 ? (
            <li className="no-content">Nenhuma anotação encontrada</li>
          ) : (
            sortedNotes.slice(0, 5).map((note) => (
              <li key={note._id} className="note">
                {note.title} <br /> {note.content.length} caracteres
              </li>
            ))
          )}
        </ul>
      </div>

      <section className='container'>
        <div className="container active">
          <h2>Anotações Ativas</h2>
          {notes.filter((note) => !note.isDeleted).length === 0 ? (
            <p className="no-content">Nenhuma anotação ativa</p>
          ) : (
            notes
              .filter((note) => !note.isDeleted)
              .slice(0, 5)
              .map((note) => (
                <div key={note._id} className="note-stats">
                  <h3>{note.title}</h3>
                  <p>Tamanho{note.content.length}</p>
                  <p>Atualizado: {note.updatedAt.toString()}</p>
                </div>
              ))
          )}
        </div>
        <div className="container inactive">
          <h2>Anotações na lixeira</h2>
          {notes.filter((note) => note.isDeleted).length === 0 ? (
            <p className="no-content">Nenhuma anotação lixeira</p>
          ) : (
            notes
              .filter((note) => note.isDeleted)
              .map((note) => (
                <div key={note._id} className="note-stats">
                  <h3>{note.title}</h3>
                  <p>Tamanho{note.content.length}</p>
                  <p>Atualizado: {note.updatedAt.toString()}</p>
                </div>
              ))
          )}
        </div>
      </section>
    </section>
  );
}
