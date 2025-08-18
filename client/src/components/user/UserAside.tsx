import { TagIcon } from 'lucide-react';
import { useNotes } from '../../context/notesContext';
import { useUser } from '../../context/userContext';
import useManageUser from '../../hook/useManageUser';

export default function UserAside() {
  const { user } = useUser();
  const { notes } = useNotes();
  const { onLogout, isLoading, Feedback } = useManageUser();
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
      <div className="profile container">
        <div>{userImg}</div>
        <h1>{user.name}</h1>
        {/* <p>{user.email}</p>
        */}
        <button  onClick={onLogout} disabled={isLoading}>
          Sair
        </button>
      </div>
      <div className="tags container">
        <h2>Tags</h2>
        <ul>
          {tags.length === 0 ? (
            <li className="no-content">Sem tags disponíveis</li>
          ) : (
            Object.keys(tags)
              .slice(0, 5)
              .map((tag) => (
                <li key={tag} className="tag">
                  <TagIcon size={16} />
                  <span className="tag-name">{tag}</span>
                  <span className="tag-count">{tags[tag]}</span>
                </li>
              ))
          )}
        </ul>
      </div>
      <div className="notes-recent container">
        <h2>Recent Notes</h2>
        <ul>
          {sortedNotes.length === 0 ? (
            <li className="no-content">Sem anotações recente</li>
          ) : (
            sortedNotes.slice(0, 5).map((note) => (
              <li key={note._id} className="note">
                {note.title || 'Untitled Note'}
              </li>
            ))
          )}
        </ul>
      </div>
      {Feedback}
    </aside>
  );
}
