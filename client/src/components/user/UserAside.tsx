import { TagIcon } from 'lucide-react';
import { useNotes } from '../../context/notesContext';
import { useUser } from '../../context/userContext';
import useManageUser from '../../hook/useManageUser';
import { Link, useNavigate } from 'react-router-dom';
import { useManageNote } from '../../hook/useManageNote';

export default function UserAside() {
  const { user } = useUser();
  const { notes } = useNotes();
  const { onLogout, isLoading, Feedback } = useManageUser();
  const { navigateToNote } = useManageNote();
  const userImg =
    user?.name
      .split(' ')
      .reduce((acc, n) => acc + n[0], '')
      .toLocaleUpperCase() || 'U';

  const sortedNotes = notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const tags = notes.reduce<Record<string, number>>((acc, note) => {
    note.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = 1;
      } else {
        acc[tag]++;
      }
    });
    return acc;
  }, {});

  if (!user) {
    return null;
  }
  return (
    <aside className="user-aside">
      <div className="profile">
        <div className="profile-img">{userImg}</div>
        <h2 className="user-name">{user.name}</h2>

        <button onClick={onLogout} disabled={isLoading}>
          Sair
        </button>
      </div>
      <div className="tags-container">
        <h2 className="section-title">Tags</h2>
        <ul>
          {tags.length === 0 ? (
            <li className="no-content">Sem tags disponíveis</li>
          ) : (
            Object.keys(tags)
              .slice(0, 4)
              .map((tag) => (
                <li key={tag}>
                  <Link to={`/notes?tag=${tag}`} className="tag">
                    <TagIcon size={16} />
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{tags[tag]}</span>
                  </Link>
                </li>
              ))
          )}
        </ul>
      </div>
      <div className="recent-notes">
        <h2 className="section-title">Recent Notes</h2>
        <nav>
          {sortedNotes.length === 0 ? (
            <li className="no-content">Sem anotações recente</li>
          ) : (
            sortedNotes.slice(0, 3).map((note) => (
              <span
                onClick={() => navigateToNote(note._id)}
                className="note"
                key={note._id}
              >
                {note.title || 'Untitled Note'}
              </span>
            ))
          )}
        </nav>
      </div>
  
        <Link to={'/'} className="back-home">Voltar para Home</Link>
    
      {Feedback}
    </aside>
  );
}
