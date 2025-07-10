import { Note, useNotes } from '../../context/notesContext';
import PinSVG from '../svgs/PinSVG';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CardNotes({ note }: { note: Note }) {
  const { selectedNote, setSelectedNote, setNotes, notes } = useNotes();
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

  const updateNotePinStatus = (
    notes: Note[],
    noteId: string,
    pinned: boolean,
  ): Note[] => {
    return notes.map((n) => (n._id === noteId ? { ...n, pinned } : n));
  };

  const handleDelete = () => {
    setNotes((n) => n.filter((n) => n._id !== note._id));
    if (selectedNote?._id === note._id) {
      setSelectedNote(null);
    }
  };

  const handlePinned = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    note.pinned = newPinned;
    setNotes(updateNotePinStatus(notes, note._id, newPinned));
  };

  useEffect(() => {
    const allCards = document.querySelectorAll('.note-card');
    allCards.forEach((card) => card.classList.remove('active'));
    allCards.forEach((card) => {
      if (selectedNote && card.id === selectedNote._id) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [notes]);

  return (
    <div className="note-card" onClick={(e) => handleClick(e)} id={note._id}>
      <h2>{title}</h2>
      <div className="note-card-actions">
        <button className="trash" onClick={handleDelete}>
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
