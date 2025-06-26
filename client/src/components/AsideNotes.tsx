import React from 'react';
import { useNotes } from '../context/notesContext';
import { HelpCircle, Settings, StickyNote, Tags, Trash } from 'lucide-react';

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
  console.log(tags);

  return (
    <aside className="aside-notes">
      <div>
        <ul>
          <li>
            <StickyNote size={16} />
            Todas as notas
          </li>
          <li>
            <Settings size={16} />
            Configurações
          </li>
          <li>
            <Tags size={16} />
            Todas as Tags
          </li>
          <li>
            <HelpCircle size={16} />
            Ajuda e Suporte
          </li>
          <li>
            <Trash size={16} />
            Lixeira
          </li>
        </ul>
      </div>
      <div>
        <div className="tags-header">
          <h2>Tags</h2> <button>Edit</button>
        </div>
        {tags.length !== 0 ? (
          tags.map((tag) => <div key={tag}># {tag}</div>)
        ) : (
          <span>Você não possui tags</span>
        )}
      </div>
    </aside>
  );
}
