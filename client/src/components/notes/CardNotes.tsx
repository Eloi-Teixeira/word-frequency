import { Note, useNotes } from '../../context/notesContext';
import PinSVG from '../svgs/PinSVG';

export default function CardNotes({ note }: { note: Note }) {
  const { setSelectedNote } = useNotes();
  const title = note.title.length > 20 ? note.title.slice(0, 20) + '...' : note.title;
  const description = note.content.length > 50 ? note.content.slice(0, 50) + '...' : note.content;

  return (
    <div className="note-card" onClick={() => setSelectedNote(note)}>
      <h2>{title}</h2>
      {note.pinned && <PinSVG />}
      <p>{description}</p>
    </div>
  );
}
