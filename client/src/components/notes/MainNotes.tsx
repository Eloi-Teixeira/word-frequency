import { MenuIcon, SquarePlus, Trash } from 'lucide-react';
import { Note, useNotes } from '../../context/notesContext';
import CardNotes from './CardNotes';
import { useEffect, useRef, useState } from 'react';
import { useManageNote } from '../../hook/useManageNote';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainNotes() {
  const { notes, search, setSearch, setSelectedNote } = useNotes();
  const [selectNote, setSelectNote] = useState<Note[]>([]);
  const [trash, setTrash] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);
  const { onCreateNote, onRestoreNote, onDeletePermanentlyNotes, Feedback } =
    useManageNote();
  const menuRef = useRef<null | HTMLDivElement>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // intervalo entre cada filho
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const selectAll = () => {
    setSelectNote(notes.filter((note) => note.isDeleted));
  };

  const unselectAll = () => {
    setSelectNote([]);
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

  const restoreNotesSelected = () => {
    if (selectNote.length === 0) {
      window.alert('Selecione uma nota');
      return;
    }
    onRestoreNote(selectNote);
  };

  const deleteAll = () => {
    if (selectNote.length === 0) {
      window.alert('Não há notas na lixeira');
    }
    setSelectNote(notes.filter((note) => note.isDeleted));
    onDeletePermanentlyNotes(selectNote);
  };

  const deleteNotesSelected = () => {
    if (selectNote.length === 0) {
      window.alert('Não há notas selecionadas');
      return;
    }
    onDeletePermanentlyNotes(selectNote);
  };

  const restoreAll = () => {
    if (notes.length === 0) {
      window.alert('Não há notas selcionadas');
      return;
    }
    setSelectNote(notes.filter((note) => note.isDeleted));
    onRestoreNote(selectNote);
  };

  useEffect(() => {
    const notesActive = notes.filter((note) => note.isDeleted === trash);
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
  }, [notes, search, trash]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpenMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpenMenu(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenMenu]);

  return (
    <section className="main-notes">
      <header className="main-notes-header">
        <button onClick={() => setIsOpenMenu((prev) => !prev)}>
          <MenuIcon size={24} />
        </button>
        {isOpenMenu && (
          <div className="main-notes-menu" ref={menuRef}>
            <button onClick={selectAll}>Selecionar todos os itens</button>
            <button onClick={unselectAll}>Remover seleção</button>
            {!trash && <button onClick={onCreateNote}>Criar nova nota</button>}
            <button onClick={restoreNotesSelected}>
              Restaurar itens selecionados
            </button>
            <button onClick={restoreAll}>Restaurar tudo</button>
            <button onClick={deleteNotesSelected}>
              Apagar todos os selecionados
            </button>
            <button onClick={deleteAll}>Apagar tudo</button>
          </div>
        )}
        <h2>Todas as notas</h2>
        <button
          onClick={() => {
            setTrash((b) => !b);
            setSelectNote([])
            setSelectedNote(null)
          }}
          title={trash ? 'Voltar para anotações?' : 'Ir para a lixeira'}
        >
          {trash ? <SquarePlus size={24} /> : <Trash size={24} />}
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
      <AnimatePresence>
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="main-notes-list"
        >
          {notesFiltered.map((note) => (
            <motion.div
              key={note._id}
              variants={item}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="card-note-container"
            >
              <motion.label>
                <input
                  type="checkbox"
                  name={note.title}
                  id={note._id}
                  checked={selectNote.some((n) => n._id === note._id)}
                  onChange={() => handleDelete(note)}
                />
              </motion.label>
              <CardNotes note={note} hasAction={!trash} />
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>
      {Feedback}
    </section>
  );
}
