import React, { useEffect } from 'react';
import { useNotes } from '../../context/notesContext';
import { useUser } from '../../context/userContext';
import { Link, NavLink } from 'react-router-dom';
import { HelpCircle, Settings, StickyNote, Tag, User } from 'lucide-react';
import LoadingPage from '../../pages/LoadingPage';

export default function AsideNotes({}) {
  const [tags, setTags] = React.useState<string[]>([]);
  const { notes, setSearch } = useNotes();
  const { user } = useUser();

  useEffect(() => {
    const activeNotes = notes.filter((note) => !note.isDeleted);
    const allTags = Array.from(
      new Set(activeNotes.flatMap((note) => note.tags)),
    );
    setTags(allTags);
  }, [notes]);

  if (!user) {
    return <LoadingPage />;
  }

  return (
    <aside className="aside-notes">
      <Link to={'/user'} className="profile">
        <div className="profile-img">
          <User></User>
        </div>
        <h2 className="user-name">{user.name}</h2>
      </Link>

      <ul className="options">
        <li>
          <NavLink to={'/notes'} end onClick={() => setSearch('')}>
            <StickyNote size={16} />
            Todas as notas
          </NavLink>
        </li>
        <li>
          <Link to={'/user'}>
            <Settings size={16} />
            Configurações
          </Link>
        </li>
        <li>
          <Link to={'/about#help'}>
            <HelpCircle size={16} />
            Ajuda e Suporte
          </Link>
        </li>
      </ul>
      <div className='tags-container'>
        <div className="tags-header">
          <h2>Tags</h2>
        </div>
        <div className="tags-content">
          {tags.length !== 0 ? (
            tags.map((tag, i) =>
              i < 9 ? (
                <span
                  className="tag"
                  key={tag}
                  onClick={() => setSearch(`#${tag}`)}
                >
                  <Tag size={16} /> {tag}
                </span>
              ) : null,
            )
          ) : (
            <span>Você não possui tags</span>
          )}
        </div>
      </div>

      <footer>
        <Link to={'shortcuts'}>Atalhos</Link>
        <Link to={'/about'}>Sobre e Contato</Link>
      </footer>
    </aside>
  );
}
