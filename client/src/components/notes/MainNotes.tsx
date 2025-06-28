import { MenuIcon, Search, SquarePlus } from 'lucide-react';
import { useNotes } from '../../context/notesContext';
import CardNotes from './CardNotes';

export default function MainNotes() {
  const { notes } = useNotes();
  const notesActive = notes.filter((note) => !note.isDeleted);
  return (
    <section className="main-notes">
      <header className="main-notes-header">
        <button>
          <MenuIcon size={24} />
        </button>
        <h2>Todas as notas</h2>
        <button>
          <SquarePlus size={24} />
        </button>
      </header>
        <label className='main-notes-search'>
          <input type="text" placeholder='Pesquisar' name='search' />
          <Search size={24} />
        </label>
      <main>
        {notesActive.map((note, i) => <CardNotes note={note} key={i}/>)}</main>
    </section>
  );
}
