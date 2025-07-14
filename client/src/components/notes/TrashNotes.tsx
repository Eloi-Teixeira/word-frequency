import { MenuIcon, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Note, useNotes } from '../../context/notesContext';
import CardNotes from './CardNotes';
import { useManageNote } from '../../hook/useManageNote';
interface TrashNotesProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const TrashNotes = ({ search, setSearch }: TrashNotesProps) => {
  const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);
  const [selectNote, setSelectNote] = useState<Note[]>([]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { notes } = useNotes();
  const { isLoading, onDeletePermanentlyNotes, Feedback, onRestoreNote } = useManageNote();

  const onDeleteNote = async () => {
    if (selectNote.length === 0) {
      window.alert('Selecione uma nota');
      return;
    }
    const response = window.confirm(
      'Tem certeza que deseja deletar permanentemente essas notas?',
    );
    if (!response) return;
    onDeletePermanentlyNotes(selectNote);
  };

  const handleDelete = (note: Note) => {
    setSelectNote((prev) => {
      const exists = prev.some((n) => n._id.toString() === note._id.toString());
      if (exists) {
        return prev.filter((n) => n._id.toString() !== note._id.toString());
      }
      return [...prev, note];
    });
  };

  const selectAll = () => {
    setSelectNote(notes.filter((note) => note.isDeleted));
  };

  const unselectAll = () => {
    setSelectNote([]);
  };

  const restoreNoteSelected = () => {
    if (selectNote.length === 0) {
      window.alert('Selecione uma nota');
      return;
    }
    onRestoreNote(selectNote);
  };

  const deleteAll = () => {
    if (selectNote.length === 0) {
      window.alert('Não há notas na lixeira');
      return;
    }
    selectAll();
    onDeletePermanentlyNotes(selectNote);
  };

  const restoreAll = () => {
    if (notes.length === 0) {
      window.alert('Não há notas na lixeira');
      return;
    }
    selectAll();
    onRestoreNote(selectNote);
  };

  useEffect(() => {
    const inactiveNote = notes.filter((note) => note.isDeleted);
    let sorted = inactiveNote.filter((note) => {
      if (search === '') return true;
      if (search.slice(0, 1) === '#') {
        if (search.length > 1) {
          const searchTerm = search.slice(1).toLowerCase();
          return note.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm),
          );
        }
        return true;
      }

      const searchTerm = search.toLowerCase();
      return note.title.toLowerCase().includes(searchTerm);
    });
    sorted = sorted.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    sorted = sorted.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    setNotesFiltered(sorted);
  }, [notes, search]);

  return (
    <section className="main-notes">
      <header className="main-notes-header">
        <button onClick={() => setIsOpenMenu((prev) => !prev)}>
          <MenuIcon size={24} />
        </button>
        {isOpenMenu && (
          <div className="main-notes-menu">
            <button onClick={selectAll}>Selecionar todos os itens</button>
            <button onClick={unselectAll}>Remover seleção</button>
            <button onClick={restoreNoteSelected}>Restaurar itens selecionados</button>
            <button onClick={restoreAll}>Restaurar tudo</button>
            <button onClick={deleteAll}>Apagar tudo na lixeira</button>
          </div>
        )}
        <h2>Todas as notas</h2>
        <button onClick={onDeleteNote} disabled={isLoading}>
          <Trash size={24} />
        </button>
      </header>
      <label className="main-notes-search">
        <input
          type="text"
          placeholder="Pesquisar"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <main>
        {notesFiltered.map((note) => (
          <label key={note._id}>
            <input
              type="checkbox"
              name={note.title}
              id={note._id}
              checked={selectNote.some((n) => n._id === note._id)}
              onChange={() => handleDelete(note)}
            />

            <CardNotes note={note} hasAction={false} />
          </label>
        ))}
      </main>
      {Feedback}
    </section>
  );
};
