import TurndownService from 'turndown';
import { Note, useNotes } from '../../context/notesContext';
import PinSVG from '../svgs/PinSVG';

export default function CardNotes({ note }: { note: Note }) {
  const { setSelectedNote } = useNotes();
  const turndownService = new TurndownService();

  const title =
    note.title.length > 20 ? note.title.slice(0, 20) + '...' : note.title;
  let description = turndownService.turndown(note.content);
  description = description.replace(/[^\p{L}\-\p{N}\s]/gu, '').trim();
  description =
    description.length > 50
      ? description.slice(0, 50).trim() + '...'
      : description;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedNote(note);
    const allCards = document.querySelectorAll('.note-card');
    allCards.forEach((card) => card.classList.remove('active'));
    e.currentTarget.classList.add('active');
  };

  return (
    <div className="note-card" onClick={(e) => handleClick(e)}>
      <h2>{title}</h2>
      {note.pinned && <PinSVG />}
      <p>{description}</p>
    </div>
  );
}
