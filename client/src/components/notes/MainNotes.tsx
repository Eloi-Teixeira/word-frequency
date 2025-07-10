import { MenuIcon, SquarePlus } from 'lucide-react';
import { Note, useNotes } from '../../context/notesContext';
import CardNotes from './CardNotes';
import { useEffect, useState } from 'react';
import { useCreateNote } from '../../hook/useCreateNote';

interface MainNotesProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function MainNotes({ search, setSearch }: MainNotesProps) {
  const { notes } = useNotes();
  const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);
  const { handleCreateNote, isCreating } = useCreateNote();

  const onCreateNote = async () => {
    try {
      await handleCreateNote();
    } catch (error) {
      // Mostrar toast de erro ou notificação
      console.error('Erro ao criar nota:', error);
    }
  };

  useEffect(() => {
    const notesActive = notes.filter((note) => !note.isDeleted);
    let sorted = notesActive.filter((note) => {
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
        <button>
          <MenuIcon size={24} />
        </button>
        <h2>Todas as notas</h2>
        <button onClick={onCreateNote} disabled={isCreating}>
          <SquarePlus size={24} />
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
          <CardNotes note={note} key={note._id} />
        ))}
      </main>
    </section>
  );
}
