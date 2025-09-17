import { Note } from '../../context/notesContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import MarkdownEditor from '../../hook/MarkdownEditor';

interface EditorNotesProps {
  note: Note;
  saveNote: (note: Note) => void;
  time?: number;
}

export const EditorNotes = ({ note, saveNote, time = 5 }: EditorNotesProps) => {
  const [title, setTitle] = useState(note.title);
  const editorRef = useRef<MarkdownEditor | null>(null);

  const latestNoteRef = useRef<Note>(note);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedSave = useCallback(
    debounce((title: string, latestNote: Note) => {
      saveNote({ ...latestNote, title });
    }, 300),
    [],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newTitleValue = e.target.value;
    if (newTitleValue.trim().length > 100) {
      window.alert('Limite da Caracteres alcançado');
      newTitleValue = newTitleValue.slice(0, 100);
    }
    const processedTitle =
      newTitleValue.length === 0 ? 'Sem título' : newTitleValue.trim();

    setTitle(newTitleValue);
    debouncedSave(processedTitle, latestNoteRef.current);

    latestNoteRef.current = {
      ...latestNoteRef.current,
      title: processedTitle,
    };
  };

  const onChangeSave = () => {
    if (editorRef.current) {
      const data = editorRef.current.exportData();
      const newNote: Note = {
        ...note,
        content: data.text,
        tags: data.tags,
        title,
        updatedAt: new Date(),
      };
      saveNote(newNote);
    }
  };
  useEffect(() => {
    setTitle(note.title);
    latestNoteRef.current = note;
  }, [note]);

  useEffect(() => {
    debounce(() => {
      saveNote(latestNoteRef.current);
    }, time * 1000 * 60);
  });

  useEffect(() => {
    const handleBeforeUnload = () => {};

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [note]);

  return (
    <article className="editor-notes">
      <div className="editor-container">
        <input
          className="title-input"
          name="title"
          value={title}
          onChange={handleTitleChange}
          type="text"
          onBlur={(e) => {
            setTitle(e.target.value.trim());
            latestNoteRef.current.title = title;
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
          }}
          placeholder="Título da nota"
        />
        <MarkdownEditor
          key={note._id}
          initialText={note.content}
          ref={editorRef}
          onChange={onChangeSave}
          className="editor"
        />
      </div>
    </article>
  );
};
