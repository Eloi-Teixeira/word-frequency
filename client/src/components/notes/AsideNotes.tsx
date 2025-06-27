import React from 'react';
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

export default function AsideNotes() {
  const [tags, setTags] = React.useState<string[]>([]);
  const { notes } = useNotes();

  if (!notes || notes.length === 0) {
  } else {
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          setTags((prevTags) => [...prevTags, tag]);
        }
      });
    });
  }

  return (
    <aside className="aside-notes">
      <div>
        <ul>
          <li>
            <NavLink to={'/notes'} end>
              <StickyNote size={16} />
              Todas as notas
            </NavLink>
          </li>
          <li>
            <Link to={'/notes/settings'}>
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
            <Link to={'/notes/help'}>
              <HelpCircle size={16} />
              Ajuda e Suporte
            </Link>
          </li>
          <li>
            <NavLink to="/notes/trash">
              <Trash size={16} />
              Lixeira
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <div className="tags-header">
          <h2>Tags</h2> <button>Edit</button>
        </div>
        <div className="tags-container">
          {tags.length !== 0 ? (
            tags.map((tag, i) =>
              i < 9 ? (
                <Link to={`/notes/${tag}`} className="tag" key={tag}>
                  <Tag size={16} /> {tag}
                </Link>
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
