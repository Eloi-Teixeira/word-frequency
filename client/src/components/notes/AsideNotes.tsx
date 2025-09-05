import React, { useEffect } from 'react';
import { useNotes } from '../../context/notesContext';
import { Link, NavLink } from 'react-router-dom';
import {
  HelpCircle,
  Settings,
  StickyNote,
  Tag,
  Tags,
  Trash,
} from 'lucide-react';

export default function AsideNotes({}) {
  const [tags, setTags] = React.useState<string[]>([]);
  const { notes, setSearch } = useNotes();

  useEffect(() => {
    const activeNotes = notes.filter((note) => !note.isDeleted);
    const allTags = Array.from(
      new Set(activeNotes.flatMap((note) => note.tags)),
    );
    setTags(allTags);
  }, [notes]);

  return (
    <aside className="aside-notes">
      <div>
        <ul>
          <li>
            <NavLink to={'/notes'} end onClick={() => setSearch('')}>
              <StickyNote size={16} />
              Todas as notas
            </NavLink>
          </li>
          <li onClick={() => setSearch('')}>
            <NavLink to="/notes/trash">
              <Trash size={16} />
              Lixeira
            </NavLink>
          </li>
          <li>
            <Link to={'/user'}>
              <Settings size={16} />
              Configurações
            </Link>
          </li>
          <li>
            <NavLink to={'/notes/tags'}>
              <Tags size={16} />
              Todas as Tags
            </NavLink>
          </li>
          <li>
            <Link to={'/about'}>
              <HelpCircle size={16} />
              Ajuda e Suporte
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div className="tags-header">
          <h2>Tags</h2>
        </div>
        <div className="tags-container">
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
