import { Note, useNotes } from '../../context/notesContext';
import PinSVG from '../svgs/PinSVG';
import { Trash } from 'lucide-react';
import { useState } from 'react';

export default function CardNotes({ note }: { note: Note }) {
  const { setSelectedNote } = useNotes();
  const [isPinned, setIsPinned] = useState(note.pinned);

  const title =
    note.title.length > 20 ? note.title.slice(0, 20) + '...' : note.title;
  const date = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement)
      return;
    setSelectedNote(note);
    const allCards = document.querySelectorAll('.note-card');
    allCards.forEach((card) => card.classList.remove('active'));
    e.currentTarget.classList.add('active');
  };

  const handlePinned = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    note.pinned = newPinned;
  };

  return (
    <div className="note-card" onClick={(e) => handleClick(e)}>
      <h2>{title}</h2>
      <div className="note-card-actions">
        <button className="trash">
          <Trash />
        </button>
        <button
          className={'pin' + (isPinned ? ' pinned' : '')}
          onClick={handlePinned}
        >
          <PinSVG />
        </button>
      </div>
        <span className="date">{date}</span>
    </div>
  );
}
