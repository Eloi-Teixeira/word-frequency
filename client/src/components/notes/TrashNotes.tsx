import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Note, useNotes } from '../../context/notesContext';
import CardNotes from './CardNotes';
import { useDeleteNote } from '../../hook/useDeleteNote';

interface TrashNotesProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const TrashNotes = ({ search, setSearch }: TrashNotesProps) => {
  const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);
  const [deleteNote, setDeleteNote] = useState<Note[]>([]);
  const { notes } = useNotes();
  const { permanentlyDeleteNote, isDeleting } = useDeleteNote();

  const onDeleteNote = async () => {
    if (deleteNote.length === 0) return;
    const response = window.confirm(
      'Tem certeza que deseja deletar permanentemente essas notas?',
    );
    if (!response) return;
    try {
      await permanentlyDeleteNote(deleteNote);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (note: Note) => {
    setDeleteNote((prev) => {
      const exists = prev.some((n) => n._id.toString() === note._id.toString());
      if (exists) {
        return prev.filter((n) => n._id.toString() !== note._id.toString());
      }
      return [...prev, note];
    });
  };

  useEffect(() => {
    console.log('deleteNote atualizado:', deleteNote);
  }, [deleteNote]);

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
        <button>lese</button>
        <h2>Todas as notas</h2>
        <button onClick={onDeleteNote} disabled={isDeleting}>
          <Trash />
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
              checked={deleteNote.some(
                (n) => n._id === note._id,
              )}
              onChange={() => handleClick(note)}
            />

            <CardNotes note={note} hasAction={false} />
          </label>
        ))}
      </main>
    </section>
  );
};
